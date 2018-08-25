import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Leaflet from "leaflet";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { compose, withState, withHandlers } from "recompose";
import NodeCard from "./nodeCard";
import "./App.css";

const token = "Insert your OCP Token";

const Body = styled.div`
  width: 100%;
  font-family: "Fira-sans" Sans-serif;
  position: relative;
`;
const Title = styled.h1`
  color: #fff;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
`;

const PopupTitle = styled.h5`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

const MapWrapper = styled.div``;

const Button = styled.button`
  background-color: #2588d0;
  border: 10px none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  height: 36px;
  letter-spacing: 0;
  line-height: 36px;
  overflow: hidden;
  padding: 0 16px;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: all 0.1s ease-in;
  white-space: nowrap;
  width: 100%;
`;

const Header = styled.div`
  height: 50px;
  background: #0f4a63d4;
  position: absolute;
  bottom: 10px;
  width: 230px;
  left: 10px;
  z-index: 999999;
  padding: 0 10px;
  border-radius: 4px;
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
  zoom: 2.5
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
                    <Marker position={node}>
                      <Popup>
                        <PopupTitle>{node.name}</PopupTitle>
                        <Button onClick={() => props.openModal(node.id)}>
                          Open
                        </Button>
                      </Popup>
                    </Marker>
                  ))}
                </Map>
              </MapWrapper>
            </Body>
          );
        }}
      </Query>
      <NodeCard
        toggleModal={props.openModal}
        modalIsOpen={props.isOpen}
        id={props.id}
      />
    </div>
  );
};

const GET_DOGS = gql`
  query {
    viewer(
      token: ${token}
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
  withState("id", "addId", null),
  withHandlers({
    openModal: props => id => {
      props.toggleModal(!props.isOpen);
      props.addId(id);
    }
  })
)(FairCoopMap);
