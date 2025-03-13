import { Card, Button, Typography } from 'antd';
import CarList from './CarList.jsx';

const { Title, Text } = Typography;

const PersonCard = ({ person, onEdit, onDelete }) => {
  return (
    <Card
      title={`${person.firstName} ${person.lastName}`}
      extra={<Button type="primary" onClick={() => onEdit(person)}>Edit</Button>}
      style={{ width: 400, marginBottom: 20 }}
    >
      <CarList personId={person.id} />
      <Button type="default" danger onClick={() => onDelete(person.id)}>
        Delete
      </Button>
    </Card>
  );
};

export default PersonCard;
