import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (data.hasOwnProperty(p) && (!(data[p] == undefined || data[p] == null))) {
      str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
    }
  }
  return str.join("&");
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cbInstance: window.Chargebee.init({
        site: "s1fl-test"
      })
    };

    this.state.cbInstance.setPortalSession(() => {
      // we have used axios for performing http requests
      // Hit your end point that returns portal session object as response
      // This sample end point will call the below api
      // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
      return axios.post("http://localhost:8000/api/generate_portal_session", urlEncode({})).then((response) => response.data);
    });

    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleCheckoutExisting = this.handleCheckoutExisting.bind(this);
    this.handlePortal = this.handlePortal.bind(this);
    this.handleUpdatePM = this.handleUpdatePM.bind(this);

    this.handleCreateItemFamily = this.handleCreateItemFamily.bind(this);
    this.handleCreateItem = this.handleCreateItem.bind(this);
    this.handleCreateItemPrice = this.handleCreateItemPrice.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
  }

  handleCheckout() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_checkout_new_url", urlEncode({})).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close() {
        console.log("checkout new closed");
      },
      step(step) {
        console.log("checkout", step);
      }
    })
  }

  handleCheckoutExisting() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_checkout_existing_url", urlEncode({ plan_id: "s1fl_test_plan" })).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close() {
        console.log("checkout existing closed");
      },
      step(step) {
        console.log("checkout existing", step);
      }
    });
  }

  handlePortal() {
    this.state.cbInstance.createChargebeePortal().open({
      visit(visit) {
        console.log("portal visit", visit);
      }
    });
  }

  handleUpdatePM() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_update_payment_method_url", urlEncode({ plan_id: "s1fl_test_plan" })).then((response) => response.data)
      },
      close() {
        console.log("update payment method closed");
      }
    });
  }


  handleCreateItemFamily() {
    return axios.post("http://localhost:8000/api/create_item_family", urlEncode({
      id: "hvac-family",
      description: "Hvac Family",
      name: "HVAC"
    })).then((response) => console.log(response.data));
  }

  handleCreateItem() {
    return axios.post("http://localhost:8000/api/create_item", urlEncode({
      id: "hvac-heater",
      name: "thunder heater",
      type: "plan",
      item_applicability: "all",
      item_family_id: "hvac-family"
    })).then((response) => console.log(response.data));
  }

  handleCreateItemPrice() {
    return axios.post("http://localhost:8000/api/create_item_price", urlEncode({
      id: "hvac-pricing",
      item_id: "hvac-heater",
      name: "Three Filter Heater",
      pricing_model: "per_unit",
      price: 100,
      external_name: "Filter Heater",
      period_unit: "month",
      period: 1
    })).then((response) => console.log(response.data));
  }

  handleCreateAccount() {
    return axios.post("http://localhost:8000/api/create_bank_account", urlEncode({})).then((response) => console.log(response.data));
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"></h1>
        </header>
        <div className="bodyContainer">
          <a href="#" onClick={this.handleCheckout}>Subscribe</a>
          <a href="#" onClick={this.handleCheckoutExisting}>Upgrade</a>
          <a href="#" onClick={this.handlePortal}>Customer Portal</a>
          <a href="#" onClick={this.handleUpdatePM}>Update payment method</a>

          <a href="#" onClick={this.handleCreateItemFamily}>Create Item Family</a>
          <a href="#" onClick={this.handleCreateItem}>Create Item</a>
          <a href="#" onClick={this.handleCreateItemPrice}>Create Item Price</a>
          <a href="#" onClick={this.handleCreateAccount}>Create Account</a>
        </div>
      </div>
    );
  }
}

export default App;
