<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          <center>
            ยินดีต้อนรับเข้าสู่ระบบ
            <br />Face 2 Face Customer Service Platform
          </center>
        </v-card-title>
        <v-responsive>
          <v-list two-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ลงทะเบียน</v-list-item-title>
                <v-list-item-subtitle>ลงทะเบียน ใบหน้า</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ถ่ายรูป</v-list-item-title>
                <v-list-item-subtitle
                  >Upload photos either by the File Upload or using your
                  Camera</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Train โมเดล</v-list-item-title>
                <v-list-item-subtitle
                  >Train the model for all users in the
                  catalog</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ใช้งาน</v-list-item-title>
                <v-list-item-subtitle
                  >Recognize your face using browser
                  camera</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-responsive>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/users">กดปุ่มเพื่อลงทะเบียน</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {};
</script>
