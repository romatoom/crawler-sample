import { ApiService } from "#utils/classes/apiService.js";

export class ForestRiverAPI extends ApiService {
  // Need copy from browser https://www.forestriverinc.com
  static bearerToken =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJFRzFyWDhqUndqRHdSZ2ducDdwZkNpWXVJU3pVX0NrLVNNSU5BTUZ6V2tVIn0.eyJleHAiOjE3MDIzNjg3ODMsImlhdCI6MTcwMjM2NTE4MywianRpIjoiMGNjYzUxZDktMDJhOC00NmFhLWIwM2EtNWRiOGMxM2M2NTc5IiwiaXNzIjoiaHR0cHM6Ly9zc28tcHJvZC5jb250ZW50LWRlbGl2ZXJ5LnR3ZWRkbGUuaW8vYXV0aC9yZWFsbXMvZm9yZXN0LXJpdmVyLW9pIiwiYXVkIjpbImZvcmVzdC1yaXZlci1vaSIsImFjY291bnQiXSwic3ViIjoiZTMzM2Y0NWQtYTBkZC00NzMxLTliZmYtOWNiZDE3OTQwY2E5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZm9yZXN0LXJpdmVyLW9pIiwic2Vzc2lvbl9zdGF0ZSI6IjQzNzhjNzcxLTlmMmQtNDNlYi1hMTc4LTI2MDQ4ODg1ZDVjMSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfSwiZm9yZXN0LXJpdmVyLW9pIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6ImZvcmVzdC1yaXZlci1vaSIsImNsaWVudEhvc3QiOiI1NC4xNzMuMTQ5LjEzMSIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1mb3Jlc3Qtcml2ZXItb2kiLCJjbGllbnRBZGRyZXNzIjoiNTQuMTczLjE0OS4xMzEiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1mb3Jlc3Qtcml2ZXItb2lAcGxhY2Vob2xkZXIub3JnIn0.Bt6rlMR82vy6JeNyfLa-uZdcdNeTdiVwopbVwdWGLRcc4EwfTU-GPOR7V8-A5lJH723DykEP6UdeNk52V69e56bTUbph54JZM2CkKjsHySu-bXvdgf_0fk2KjD1c_hE-ck4miUoTJPUbN4utp-Ls1tsORBvwzJZERnlNFVkGJr3O5R0chh4jnMTWcXrSa1bU-rCp-du3-iBAEZlmUDs77lKSBQ3WlNSICV2hNuAU9VwpMqv0HUAFk6grfCBmvZ7NYJnT3M3xrxjsVr9T7kzlISx25uHyHWCNeRT-N5oBzcWTI2WXtqaltyVbaejXzpeM83zz-b2mQT9BjP9sEW_AGw";

  static apiURL = "https://content.forest-river.tweddle.io/api/v2";

  static async getVehicles() {
    const url = `${ForestRiverAPI.apiURL}/info/vehicles`;

    return this.get(url, {
      headers: {
        Authorization: "Bearer " + ForestRiverAPI.bearerToken,
      },
    });
  }

  static async getVehicleInfo(make, year, model) {
    const url = `${ForestRiverAPI.apiURL}/contents/heroShots?make=${make}&model=${model}&year=${year}&locale=en_US`;

    return this.get(url, {
      headers: {
        Authorization: "Bearer " + ForestRiverAPI.bearerToken,
      },
    });
  }

  static async getDocumentsForVehicle(make, year, model) {
    const url = `${ForestRiverAPI.apiURL}/contents/publications?make=${make}&year=${year}&model=${model}&locale=en_US&locale=fr_CA&publicationType=OG`;

    return this.get(url, {
      headers: {
        Authorization: "Bearer " + ForestRiverAPI.bearerToken,
      },
    });
  }
}
