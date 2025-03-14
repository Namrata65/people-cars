import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CAR } from "../graphql/mutations";
import { GET_CARS, GET_PEOPLE } from "../graphql/queries";
import { Form, Input, Button, Select, message } from "antd";

const AddCar = () => {
  const [form] = Form.useForm();
  const [addCar, { loading, error }] = useMutation(ADD_CAR, {
    refetchQueries: [{ query: GET_CARS }],
    onCompleted: () => {
      message.success("Car added successfully!");
    },
  });

  const {
    loading: peopleLoading,
    data: peopleData,
    error: peopleError,
  } = useQuery(GET_PEOPLE);

  const handleSubmit = async (values) => {
    try {
      await addCar({
        variables: {
          year: parseInt(values.year, 10),
          make: values.make,
          model: values.model,
          price: parseFloat(values.price),
          personId: values.personId,
        },
      });
      form.resetFields();
    } catch (err) {
      message.error("Error adding car!");
    }
  };

  if (peopleLoading) return <p>Loading...</p>;
  if (peopleError) return <p>Error loading people data!</p>;

  return (
    <div>
      <h2>Add a New Car</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="horizontal"
        className="add-car-form"
      >
        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: "Please input the car year!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="make"
          label="Make"
          rules={[{ required: true, message: "Please input the car make!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="model"
          label="Model"
          rules={[{ required: true, message: "Please input the car model!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input the car price!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="personId"
          label="Owner"
          rules={[{ required: true, message: "Please select the car owner!" }]}
        >
          <Select placeholder="Select owner">
            {peopleData.people.map((person) => (
              <Select.Option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Car
          </Button>
        </Form.Item>

        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </Form>
    </div>
  );
};

export default AddCar;
