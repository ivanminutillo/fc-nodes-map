import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Leaflet from "leaflet";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { compose, withState, withHandlers } from "recompose";
import NodeCard from "./nodeCard";
import {Button} from 'oce-components/build'
import "./App.css";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml2YW4iLCJpYXQiOjE1MjkzNDYxOTYsInBhc3N3b3JkIjoiNDRkN2I5YmYyYWZiNmMyN2Q5NDk1MzhhNGQwY2RjYWM0NDgzZDUwNSIsImlkIjoyNjd9.BqohFPzbp5176Gpmr5OhFImqo9wgaB8115hdyxM8PgQ";

const Body = styled.div`
  width: 100%;
  font-family: "Fira-sans" Sans-serif;
  position: relative;
`;
const Title = styled.h1`
  color: #333;
  display: inline-block;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  height: 50px;
  line-height: 50px;
  float: left;
`;

const PopupTitle = styled.h5`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

const MapWrapper = styled.div`
  padding-top: 50px;
`;

const Header = styled.div`
  height: 50px;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999999999999999999;
  padding: 0 10px;
  box-shadow: 0 0px 10px 0px rgba(0, 0, 0, 0.2);
`;

const Link = styled.div``;

const Right = styled.div`
  float: right;
`;

Leaflet.Icon.Default.imagePath =
  "//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/";

const state = {
  lat: 51.505,
  lng: -0.09,
  zoom: 3
};
const FairCoopMap = props => {
  const position = [state.lat, state.lng];
  return (
    <div>
      <Query query={GET_DOGS}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          let allNodes = [];
          let nodes = data.viewer.agent.agentRelationships.map(node => {
            if (node.subject.primaryLocation) {
              allNodes.push({
                name: node.subject.name,
                id: node.subject.id,
                lat: node.subject.primaryLocation.latitude,
                lng: node.subject.primaryLocation.longitude
              });
            }
          });
          console.log(allNodes);
          return (
            <Body>
              <Header>
                <Title>FairCoop Local nodes map</Title>
                {/* <Right><Link>Resources</Link></Right> */}
              </Header>
              <MapWrapper>
                <Map className={"wrapper"} center={position} zoom={state.zoom}>
                  <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {allNodes.map((node, i) => (
                    <Marker position={node} onClick={() => console.log("hhhh")}>
                      <Popup>
                        <PopupTitle>{node.name}</PopupTitle>
                        <Button onClick={props.openModal}>Open</Button>
                      </Popup>
                    </Marker>
                  ))}
                </Map>
              </MapWrapper>
            </Body>
          );
        }}
      </Query>
      <NodeCard toggleModal={props.openModal} modalIsOpen={props.isOpen} />
    </div>
  );
};

const GET_DOGS = gql`
  query {
    viewer(
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml2YW4iLCJpYXQiOjE1MjkzNDYxOTYsInBhc3N3b3JkIjoiNDRkN2I5YmYyYWZiNmMyN2Q5NDk1MzhhNGQwY2RjYWM0NDgzZDUwNSIsImlkIjoyNjd9.BqohFPzbp5176Gpmr5OhFImqo9wgaB8115hdyxM8PgQ"
    ) {
      agent(id: 172) {
        name
        agentRelationships(category: PART) {
          id
          subject {
            name
            type
            id
            primaryLocation {
              longitude
              latitude
            }
          }
          relationship {
            label
            category
          }
          object {
            name
            type
          }
        }
      }
    }
  }
`;

export default compose(
  withState("isOpen", "toggleModal", false),
  withHandlers({
    openModal: props => () => {
      console.log('here')
      props.toggleModal(!props.isOpen);
    }
  })
)(FairCoopMap);
