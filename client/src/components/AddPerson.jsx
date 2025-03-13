import { Form, Input, Button } from 'antd';
import { useMutation } from '@apollo/client';
import { ADD_PERSON } from '../graphql/mutations';
import { GET_PEOPLE } from '../graphql/queries';

const AddPerson = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [addPerson, { loading, error }] = useMutation(ADD_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }], // Refresh the person list after adding
  });

  const handleSubmit = async (values) => {
    try {
      await addPerson({ variables: { firstName: values.firstName, lastName: values.lastName } });
      form.resetFields(); // Clear the form after successful submission
    } catch (err) {
      console.error("Error adding person:", err);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="horizontal" className="add-person-form">
      <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Enter first name' }]}>
        <Input placeholder="Enter first name" />
      </Form.Item>

      <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Enter last name' }]}>
        <Input placeholder="Enter last name" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>Add Person</Button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </Form>
  );
};

export default AddPerson;
