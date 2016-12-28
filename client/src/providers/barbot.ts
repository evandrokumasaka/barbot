import { Injectable } from '@angular/core';
import { Events, LoadingController } from 'ionic-angular';
import { Toast, BluetoothSerial } from 'ionic-native';
import 'rxjs/add/operator/map';

@Injectable()
export class Barbot {
  document = document;

  private loaderIsPresent: boolean = false;

  constructor(public loadingCtrl: LoadingController,
              private events: Events
  ) {
    this.listenToEvents();
  }

  listenToEvents() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.events.subscribe('barbot:move', (ingredient) => {
      if(!this.loaderIsPresent) {
        this.loaderIsPresent = true;
        loader.present();
      }

      let loadingContent = this.document.getElementsByClassName("loading-content");

      if(loadingContent) loadingContent[0].innerHTML = ingredient;
    });

    this.events.subscribe('barbot:home', () => {
      this.loaderIsPresent = false;
      loader.dismiss().then(() => {
        Toast.show('Your cocktail is ready!', '4000', 'center').subscribe(toast => {});
      });

      loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
    });
  }

  getStatus() {
    return new Promise((resolve, reject) => {
      BluetoothSerial.isConnected().then(
        success => {
          resolve({code: 0, statusText: 'Connected', buttonText: 'Disconnect'});
        },
        error => {
          resolve({code: 1, statusText: 'Not Connected', buttonText: 'Connect'});
        }
      );
    });
  }

}
