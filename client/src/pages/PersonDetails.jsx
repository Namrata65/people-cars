import { useQuery, gql } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { Card, Spin } from "antd";
import CarList from "../components/CarList";

const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

const PersonDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON, { variables: { id } });

  if (loading) return <Spin />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="person-details-card-container" style={{ padding: 20 }}>
      <Card title={`${data.person.firstName} ${data.person.lastName}`} style={{ width: "100%" }}>
        <p>ID: {data.person.id}</p>
        <h3>Cars:</h3>
        <CarList personId={data.person.id} />
        <Link to="/">Go Back Home</Link>
      </Card>
    </div>
  );
};

export default PersonDetails;
