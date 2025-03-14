import { useQuery, useMutation, gql } from "@apollo/client";
import { List, Card, Spin, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

const GET_CARS = gql`
  query GetCars {
    cars {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id)
  }
`;

const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $year: Int!, $make: String!, $model: String!, $price: Float!, $personId: ID!) {
    updateCar(id: $id, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const CarList = ({ personId }) => {
  const { loading, error, data, refetch } = useQuery(GET_CARS);
  const { data: peopleData } = useQuery(GET_PEOPLE);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [updateCar] = useMutation(UPDATE_CAR);
  const [editingCarId, setEditingCarId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  if (loading) return <Spin />;
  if (error) return <p>Error: {error.message}</p>;

  const personCars = data.cars.filter((car) => car.personId === personId);


  const handleDelete = async (id) => {
    try {
      await deleteCar({ variables: { id } });
      message.success("Car deleted successfully");
      refetch(); 
    } catch (err) {
      message.error("Error deleting car");
    }
  };

  
  const handleEdit = (car) => {
    setEditingCarId(car.id);
    setEditedValues({
      year: car.year.toString(),
      make: car.make,
      model: car.model,
      price: car.price.toString(),
      personId: car.personId,
    });
  };

  
  const handleChange = (e, field) => {
    setEditedValues({ ...editedValues, [field]: e.target.value });
  };

  
  const handlePersonChange = (value) => {
    setEditedValues({ ...editedValues, personId: value });
  };

  
  const handleSave = async (id) => {
    try {
      await updateCar({
        variables: {
          id,
          year: parseInt(editedValues.year),
          make: editedValues.make,
          model: editedValues.model,
          price: parseFloat(editedValues.price),
          personId: editedValues.personId,
        },
      });
      message.success("Car updated successfully");
      setEditingCarId(null);
      refetch();
    } catch (err) {
      message.error("Error updating car");
    }
  };

  return (
    <List
      dataSource={personCars}
      className="car-list-container"
      renderItem={(car) => (
        <Card
          key={car.id}
          className="car-details-card"
          actions={[
            editingCarId === car.id ? (
              <div className="buttons-container">
                <CheckOutlined key="save" onClick={() => handleSave(car.id)} style={{ color: "green" }} />
                <CloseOutlined key="cancel" onClick={() => setEditingCarId(null)} style={{ color: "red" }} />
              </div>
            ) : (
              <EditOutlined key="edit" onClick={() => handleEdit(car)} />
            ),
            <DeleteOutlined key="delete" onClick={() => handleDelete(car.id)} style={{ color: "red" }} />,
          ]}
        >
          {editingCarId === car.id ? (
            <div className="edit-car-list">
              <Input value={editedValues.year} onChange={(e) => handleChange(e, "year")} placeholder="Year" />
              <Input value={editedValues.make} onChange={(e) => handleChange(e, "make")} placeholder="Make" style={{ marginTop: "8px" }} />
              <Input value={editedValues.model} onChange={(e) => handleChange(e, "model")} placeholder="Model" style={{ marginTop: "8px" }} />
              <Input value={editedValues.price} onChange={(e) => handleChange(e, "price")} placeholder="Price" style={{ marginTop: "8px" }} />
              <Select
                value={editedValues.personId}
                onChange={handlePersonChange}
                style={{ width: "100%", marginTop: "8px" }}
              >
                {peopleData?.people.map((person) => (
                  <Select.Option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : (
            <>
              <p>Year: {car.year}</p>
              <p>Make: {car.make}</p>
              <p>Model: {car.model}</p>
              <p>Price: ${car.price.toLocaleString()}</p>
            </>
          )}
        </Card>
      )}
    />
  );
};

export default CarList;
