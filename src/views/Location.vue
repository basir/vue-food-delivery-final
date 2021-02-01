<template>
  <v-container>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          Delivery Location
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2">
          Customer Info
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> Pay Order </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content class="stepper-map" step="1">
          <div class="map-container">
            <l-map
              ref="myMap"
              :zoom="zoom"
              :center="center"
              :options="mapOptions"
              @update:center="centerUpdate"
              @update:zoom="zoomUpdate"
            >
              <l-tile-layer :url="url" :attribution="attribution" />
              <l-control position="topright">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  v-if="loadingMap"
                ></v-progress-circular>
              </l-control>
              <v-geosearch :options="geosearchOptions"></v-geosearch>
              <l-marker :lat-lng="currentCenter"></l-marker>
            </l-map>
          </div>
          <div class="d-flex justify-center pt-6">
            <v-btn color="primary" @click="step = 2"> Next </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="30"
              :rules="nameRules"
              label="Name"
              name="name"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              name="email"
              required
            ></v-text-field>
            <v-text-field
              v-model="address"
              label="Address"
              name="address"
              required
            ></v-text-field>
            <v-text-field
              v-model="locality"
              label="Locality"
              name="locality"
              required
            ></v-text-field>
            <v-text-field
              v-model="city"
              label="City"
              name="city"
              required
            ></v-text-field>
          </v-form>
          <v-btn depressed @click="step = 1"> Back </v-btn>{{ " " }}
          <v-btn color="primary" @click="validate"> Continue </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div id="paypal-button"></div>
          <!-- <div v-if="!paypalButtonRendered">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
            Loading PayPal
          </div> -->
          <v-btn v-if="!paypalButtonRendered" depressed @click="step = 2">
            Back
          </v-btn>
          <!-- <v-btn color="primary" @click="confirmOrder"> Confirm Order </v-btn> -->
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { latLng, Icon } from "leaflet";
import { LMap, LTileLayer, LMarker, LControl } from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import axios from "axios";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const defaultLocation = latLng(45.516, -73.56);

export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    VGeosearch,
  },
  data() {
    return {
      step: 0,
      // map
      loadingMap: true,
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: "bar",
      },
      zoom: 16,
      center: defaultLocation,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 16,
      currentCenter: defaultLocation,
      mapOptions: {
        zoomSnap: 0.5,
      },
      // form
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 30) || "Name must be less than 30 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      address: "",
      locality: "",
      city: "",
      // payment
      loadingPaypal: true,
      paypalButtonRendered: false,
    };
  },
  mounted() {
    this.step = 1;
  },
  methods: {
    initMap() {
      this.map = this.$refs.myMap.mapObject;
      this.map.invalidateSize();
      this.getUserLocation();
    },
    getUserLocation() {
      if (!navigator.geolocation) {
        alert("Geolocation os not supported by this browser");
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = latLng(
            position.coords.latitude,
            position.coords.longitude
          );
          this.map.invalidateSize();
          this.loadingMap = false;
        });
      }
    },
    nextStep() {},
    confirmOrder() {},
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.step = 3;
      }
    },
  },
  watch: {
    loadingPaypal(to) {
      if (to === false) {
        window.paypal.Button.render(
          {
            env:
              process.env.NODE_ENV === "development" ? "sandbox" : "production",
            client: {
              [process.env.NODE_ENV === "development"
                ? "sandbox"
                : "production"]: this.paypalClientId || "sb",
            },

            locale: "en_US",
            style: {
              size: "medium",
              color: "gold",
              shape: "pill",
            },

            commit: true,

            payment: function (data, actions) {
              return actions.payment.create({
                transactions: [
                  {
                    amount: {
                      total: "11",
                      currency: "USD",
                    },
                  },
                ],
              });
            },

            onAuthorize: function (data, actions) {
              return actions.payment.execute().then(function () {
                window.alert("Thank you for your purchase!");
              });
            },
          },
          "#paypal-button"
        ).then(() => {
          this.paypalButtonRendered = true;
        });
      }
    },
    async step(to, from) {
      if (to === 1 && from === 0) {
        this.initMap();
      }
      // react to route changes...
      if (to === 2 && from === 1) {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${this.currentCenter.lat}&longitude=${this.currentCenter.lng}&localityLanguage=en`;
        const { data } = await axios.get(url);
        this.locality = data.locality;
        this.city = data.city;
      }
      if (to === 3) {
        this.loadingPaypal = true;
        if (!window.paypal) {
          const { data } = await axios.get("/api/config/paypal");
          this.paypalClientId = data;
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `https://www.paypalobjects123.com/api/checkout.js`;
          script.async = true;
          script.onload = () => {
            this.loadingPaypal = false;
          };
          document.body.appendChild(script);
        } else {
          this.loadingPaypal = false;
        }
      }
    },
  },
};
</script> 
<style>
@import "https://unpkg.com/leaflet-geosearch@2.6.0/assets/css/leaflet.css";
html,
body {
  height: 100%;
  margin: 0;
}
.stepper-map {
  padding: 0 0 20px 0 !important;
}
.map-container {
  height: 500px;
}
</style>
