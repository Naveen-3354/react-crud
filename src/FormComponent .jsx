import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import { Form, Button, Table, Modal } from "react-bootstrap";
import "./FormComponent.css";
import axios from "axios";
const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    getAllData();
  }, [formData, entries]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const getAllData = async () => {
    const response = await axios.get("http://localhost:8080/student/all");
    setEntries(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
    };
    const response = await axios.post(
      "http://localhost:8080/student",
      newEntry
    );
    console.log(response);
    setMessage({data:response.data, title:"Created",variant:"success"})
    setShow(true);
    // setEntries([...entries, newEntry]);
    setFormData({
      name: "",
      email: "",
      number: "",
    });
  };

  const handleDelete = async(index) => {
    const response = await axios.delete("http://localhost:8080/student/"+index)
    setMessage({data:response.data, title:"Deleted", variant:"danger"})
    setShow(true);
  };

  const handleEdit = (index) => {
    setSelectedIndex(index);
    setFormData(entries.find((x)=>x.id === index));
    setShowModal(true);
  };

  const handleSaveEdit = async() => {
    const updatedEntry = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
    };
    const response = await axios.put("http://localhost:8080/student/"+selectedIndex, updatedEntry)
    setMessage({data:response.data, title:"Updated", variant:"info  "})
    setShow(true);
    setFormData({
      name: "",
      email: "",
      number: "",
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="form">
        <h2>Student Form</h2>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formNumber">
          <Form.Label>Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <hr />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.number}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(entry.id)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(entry.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formEditName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEditEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEditNumber">
            <Form.Label>Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter number"
              name="number"
              value={formData.number}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="toasts">
        <Toast onClose={() => setShow(false)} bg={message.variant} show={show} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto" >{message.title}</strong>
          </Toast.Header>
          <Toast.Body className='text-white'>{message.data}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
};

export default FormComponent;
