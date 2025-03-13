import { useQuery, useMutation, gql } from "@apollo/client";
import { Card, Spin, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import AddPerson from "./AddPerson";
import AddCar from "./AddCar";
import CarList from "./CarList.jsx";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id)
  }
`;

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String!, $lastName: String!) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const PersonList = () => {
  const { loading, error, data, refetch } = useQuery(GET_PEOPLE);
  const [deletePerson] = useMutation(DELETE_PERSON);
  const [updatePerson] = useMutation(UPDATE_PERSON);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  if (loading) return <Spin />;
  if (error) return <p>Error: {error.message}</p>;

  // DELETE PERSON FUNCTION
  const handleDelete = async (id) => {
    try {
      await deletePerson({ variables: { id } });
      message.success("Person deleted successfully");
      refetch(); // Refresh the list after deletion
    } catch (err) {
      message.error("Error deleting person");
    }
  };

  // EDIT MODE TOGGLE
  const handleEdit = (person) => {
    setEditingPersonId(person.id);
    setEditedValues({ firstName: person.firstName, lastName: person.lastName });
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e, field) => {
    setEditedValues({ ...editedValues, [field]: e.target.value });
  };

  // HANDLE SAVE
  const handleSave = async (id) => {
    try {
      await updatePerson({
        variables: { id, ...editedValues },
      });
      message.success("Person updated successfully");
      setEditingPersonId(null);
      refetch();
    } catch (err) {
      message.error("Error updating person");
    }
  };

  return (
    <>
      <Card title="People With Cars">
        <AddPerson />
        {( (data && data?.people.length) > 0) ? <AddCar /> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "36px", padding: "50px" }}>
          {data.people.map((person) => (
            <Card
              key={person.id}
              style={{ width: 500 }}
              extra={<Link to={`/people/${person.id}`}>Learn More</Link>}
              actions={[
                editingPersonId === person.id ? (
                  <>
                    <CheckOutlined key="save" onClick={() => handleSave(person.id)} style={{ color: "green" }} />
                    <CloseOutlined key="cancel" onClick={() => setEditingPersonId(null)} style={{ color: "red" }} />
                  </>
                ) : (
                  <EditOutlined key="edit" onClick={() => handleEdit(person)} />
                ),
                <DeleteOutlined key="delete" onClick={() => handleDelete(person.id)} style={{ color: "red" }} />,
              ]}
            >
              {editingPersonId === person.id ? (
                <div>
                  <Input
                    value={editedValues.firstName}
                    onChange={(e) => handleChange(e, "firstName")}
                    placeholder="First Name"
                    style={{ marginBottom: "8px" }}
                  />
                  <Input
                    value={editedValues.lastName}
                    onChange={(e) => handleChange(e, "lastName")}
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <h3>{person.firstName} {person.lastName}</h3>
              )}
              <CarList personId={person.id} />
            </Card>
          ))}
        </div>
      </Card>
    </>
  );
};

export default PersonList;
