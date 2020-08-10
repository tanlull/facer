<template>
  <v-layout row align-center justify-center wrap>
    <v-col cols="6" sm="3" md="3">
      <v-text-field
        label="ชื่อลูกค้า"
        placeholder="นายธัญญา สัตยาอภิธาน"
        :value="customerName"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="3" md="3">
      <v-text-field
        label="Customer Lifetime Value"
        placeholder="1,000,000"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="3" md="3">
      <v-text-field
        label="บริการที่ใช้งาน"
        placeholder="Fttx - Net แรง 300/300"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="3" md="3">
      <v-text-field
        label="ค่าบริการค้างชำระ"
        placeholder="535"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="3" md="3">
      <v-text-field
        label="ความรู้สึก"
        placeholder="มีความสุข"
        :value="CustomerMood"
        outlined
      ></v-text-field>
    </v-col>
    <v-col cols="3" sm="3" md="3">
      <v-text-field label="Churn" placeholder="High" outlined></v-text-field>
    </v-col>
    <v-flex xs12 md6>
      <canvas id="live-canvas" width="320" height="247" />
    </v-flex>
    <v-flex xs12 md6>
      <div style="visibility: hidden">
        <video id="live-video" width="0" height="0" autoplay />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      fps: 1,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: "",
      withOptions: [0, 0, 2, 3],
      customerName: "",
      CustomerMood: ""
    };
  },

  computed: {
    models() {
      return this.$store.state.model.list;
    }
  },

  watch: {
    fps(newFps) {
      const videoDiv = document.getElementById("live-video");
      const canvasDiv = document.getElementById("live-canvas");
      const canvasCtx = canvasDiv.getContext("2d");
      this.start(videoDiv, canvasDiv, canvasCtx, newFps);
    }
  },

  async beforeMount() {
    const self = this;
    await self.$store
      .dispatch("face/getAll")
      .then(() => self.$store.dispatch("face/getFaceMatcher"));
  },

  async mounted() {
    await this.recognize();
  },

  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.$store.dispatch("camera/stopCamera");
  },

  methods: {
    start(videoDiv, canvasDiv, canvasCtx, fps) {
      const self = this;
      if (self.interval) {
        clearInterval(self.interval);
      }
      self.interval = setInterval(async () => {
        const t0 = performance.now();
        canvasCtx.drawImage(videoDiv, 0, 0, 320, 247);
        const options = {
          detectionsEnabled: self.withOptions.find(o => o === 0) === 0,
          landmarksEnabled: self.withOptions.find(o => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find(o => o === 2) === 2,
          expressionsEnabled: self.withOptions.find(o => o === 3) === 3
        };
        const detections = await self.$store.dispatch(
          "face/getFaceDetections",
          { canvas: canvasDiv, options }
        );
        if (detections.length) {
          if (self.isProgressActive) {
            self.increaseProgress();
            self.isProgressActive = false;
          }
          detections.forEach(async detection => {
            detection.recognition = await self.$store.dispatch(
              "face/recognize",
              {
                descriptor: detection.descriptor,
                options
              }
            );

            if (!detection.recognition) return;

            console.log("Recognized:", detection);
            // Assign Label
            const { label } = detection.recognition;
            this.customerName = label;

            // Assign Expression
            //  console.log("Expression:", expressions);
            const expressions = detection.expressions;
            const maxMoodConf = Math.max(...Object.values(expressions));
            const key = Object.keys(expressions).filter(function(key) {
              return expressions[key] === maxMoodConf;
            })[0];
            this.CustomerMood = key;

            self.$store.dispatch("face/draw", {
              canvasDiv,
              canvasCtx,
              detection,
              options
            });
          });
        }
        const t1 = performance.now();
        self.duration = (t1 - t0).toFixed(2);
        self.realFps = (1000 / (t1 - t0)).toFixed(2);
      }, 1000 / fps);
    },
    async recognize() {
      const self = this;
      self.increaseProgress();
      await self.$store.dispatch("camera/startCamera").then(stream => {
        const videoDiv = document.getElementById("live-video");
        const canvasDiv = document.getElementById("live-canvas");
        const canvasCtx = canvasDiv.getContext("2d");
        videoDiv.srcObject = stream;

        self.increaseProgress();
        self.start(videoDiv, canvasDiv, canvasCtx, self.fps);
      });
    },

    increaseProgress() {
      const self = this;
      self.progress = (100 / self.step) * ++self.counter;
    }
  }
};
</script>
