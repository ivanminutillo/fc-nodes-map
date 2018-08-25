import React from "react";
import Modal from "./modal";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import {Icons} from 'oce-components/build'

const Wrapper = styled.div`
  padding: 30px;
`;

const Title = styled.a`
  margin: 0;
  font-size: 16px;
  display: block;
  color: #333;
  font-weight: 600;
`;

const SupTitle = styled.h5`
    margin: 0;
    margin-top: 10px
    font-size: 13px;
    letter-spacing: 1px;
    text-trasform: uppercase;
`;

const Text = styled.h5`
  margin: 0;
  font-size: 13px;
  margin-top: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const List = styled.div`
  border-bottom: 1px solid #dadada;
  padding-bottom: 8px;
`;

const Span = styled.span`
margin-right: 8px;
vertical-align: sub;
`

const H5 = styled.a`
  margin-top: 8px;
  font-weight: 400;
  font-size: 13px;
  font-style: italic;
  display: block;
  color: #333;
  letter-spacing: 0.5px;
`;

const NCModal = ({ toggleModal, modalIsOpen, id }) => (
  <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
    <Query
      query={GET_DOGS}
      variables={{
        id: id
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <Wrapper>Loading...</Wrapper>;
        if (error) return `Error! ${error.message}`;
        console.log(data);
        return (
          <Wrapper>
            <Title target='blank' href={'https://agent.fair.coop/agent' + data.viewer.agent.id}><Span><Icons.Globe width='18' height='18' color="#333"/></Span>{data.viewer.agent.name}</Title>
            {data.viewer.agent.note
            ? <Text>{data.viewer.agent.note}</Text>
            : null }
            {data.viewer.agent.email
            ? <Text><Span><Icons.Message width='18' height='18' color="#333"/></Span>{data.viewer.agent.email}</Text>
            : null }
            <SupTitle><Span><Icons.Preferites width='18' height='18' color="#333"/></Span>FairCoin Address: {data.viewer.agent.faircoinAddress}</SupTitle>
            <SupTitle><Span><Icons.Inventory width='18' height='18' color="#333"/></Span>Resources</SupTitle>
            <List>
              {data.viewer.agent.ownedEconomicResources.map((item, i) => (
                <H5 key={i}>{item.resourceClassifiedAs.name}</H5>
              ))}
            </List>
            <SupTitle><Span><Icons.Users width='18' height='18' color="#333"/></Span>Partecipants ({data.viewer.agent.agentRelationships.length})</SupTitle>
            <List>
              {data.viewer.agent.agentRelationships.map((item, i) => (
                <H5 target='blank' href={'https://agent.fair.coop/agent/' + item.subject.id} key={i}>{item.subject.name}</H5>
              ))}
            </List>
          </Wrapper>
        );
      }}
    </Query>
  </Modal>
);

const GET_DOGS = gql`
  query($id: Int!) {
    viewer(
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml2YW4iLCJpYXQiOjE1MjkzNDYxOTYsInBhc3N3b3JkIjoiNDRkN2I5YmYyYWZiNmMyN2Q5NDk1MzhhNGQwY2RjYWM0NDgzZDUwNSIsImlkIjoyNjd9.BqohFPzbp5176Gpmr5OhFImqo9wgaB8115hdyxM8PgQ"
    ) {
      agent(id: $id) {
        name
        id
        note
        faircoinAddress
        email
        agentRelationships(category:MEMBER) {
          subject {
            name
            id
          }
        }
        ownedEconomicResources(category: INVENTORY) {
          id
          resourceClassifiedAs {
            name
            category
          }
          trackingIdentifier
          currentQuantity {
            numericValue
            unit {
              name
            }
          }
        }
      }
    }
  }
`;
export default NCModal;
