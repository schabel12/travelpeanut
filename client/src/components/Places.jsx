import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import axios from 'axios'
import LazyLoad from 'react-lazyload'
import { GOOGLE_PLACES, unsplashAPI } from '../../../config'
import * as discoveryActions from '../actions/discoveryActions.js'

class Places extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      place: this.props.place,     
    }
    this.addToItenerary = this.addToItenerary.bind(this)
    this.redirectAddPlace = this.redirectAddPlace.bind(this)
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.setState({
      place: null
    })
  }

  addToItenerary() {
    const place = this.props.place    
    this.props.actions.stagePlace(place)
    this.redirectAddPlace(place.name)
  }

  redirectAddPlace(){        
    let placeName = this.props.place.name.trim()
    let tripCity = this.props.tripState.currentTrip.city.trim()
    let discoverType = window.location.pathname.split(`/`)[4];
    this.props.history.push(`/trip/${tripCity}/discovery/${discoverType}/${placeName}/addToItinerary`)
  }

  render() {
    return (
      <div className="yelp">

        <div>
          <a className="yelp-header" href={this.state.place.url} target="_blank">{this.state.place.name}</a>
          <div className="yelp-address">{this.state.place.location.display_address[0].concat(' ', this.state.place.location.display_address[1])}</div>
          <div className="yelp-phone">phone number: {this.state.place.display_phone}</div>      
          <div className="yelp-rating">rating: {this.state.place.rating}</div>
          <div className="yelp-price">{this.state.place.price}</div>
        </div>

        <button className="btn-tran draw-border" onClick={this.addToItenerary}>add to trip</button>

        <div className="photos-container">
          <LazyLoad>
            <iframe className="photos-photo google-map" src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_PLACES}&q=${this.state.place.name}`}></iframe>
          </LazyLoad>
        </div>        

      </div>
    )      
  }
}

export default connect(
  state => ({
      tripState: state.tripReducer,
  }),
  dispatch => ({
      actions: bindActionCreators( discoveryActions , dispatch)
  })
)(Places);