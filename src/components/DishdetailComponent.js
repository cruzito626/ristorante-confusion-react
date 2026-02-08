import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Col,
  Row
} from 'reactstrap';

import { Control, LocalForm, Errors } from 'react-redux-form';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));


const RenderDish = ({ dish }) => {
  const { name, image, description } = dish;
  return (
    <div className='col-6'>
      <Card>
        <CardImg top src={image} alt={name} />
        <CardBody>
          <CardTitle>{name}</CardTitle>
          <CardText>{description}</CardText>
        </CardBody>
      </Card>
    </div>
  );
};


class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false

    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    console.log('Current State is: ' + JSON.stringify(values));
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render() {
    return <div>
      <Button outline color="secondary" onClick={this.toggleModal}><i className="fa fa-pencil" /> Submit Comment</Button>

      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>

        <ModalBody>
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>

            <Row className="form-group">
              <Label htmlFor="rating" md={12} >Rating</Label>
              <Col md={12}>
                <Control.select model=".rating"
                  className="form-control"
                  name="rating"
                  id="rating"
                  validators={{
                    required,
                    isNumber
                  }}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Control.select>
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  messages={{
                    required: 'Required',
                  }}
                />
              </Col>
            </Row>


            <Row className="form-group">
              <Label htmlFor="author" md={12}>Your Name</Label>
              <Col md={12}>
                <Control.text model=".author" id="author" name="author"
                  placeholder="Your Name"
                  className="form-control"
                  validators={{
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(15)
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  messages={{
                    required: "Required",
                    minLength: "Must be greater tha 2 characters",
                    maxLength: "Must be 15 chatacters or less",
                  }}
                />
              </Col>
            </Row>

            <Row className="form-group">
              <Label htmlFor="comment" md={12}>Comment</Label>
              <Col md={12}>
                <Control.textarea model=".comment" id="comment" name="comment"
                  rows="6"
                  className="form-control"></Control.textarea>
              </Col>
            </Row>
            <Button type="submit" value="submit" color="primary">Submit</Button>
          </LocalForm>

        </ModalBody>
      </Modal>
    </div>

  };
}

class RenderComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false

    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    console.log('Current State is: ' + JSON.stringify(values));
    alert('Current State is: ' + JSON.stringify(values));
  };

  render() {
    const dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
    const region = 'en-US';
    const { comments, addComment, dishId } = this.props;
    return (
      <div className='col-6'>
        <div>
          <h4>Coments</h4>
          <ul className="list-unstyled">
            {
              comments.map((comment) => {
                let { id, comment: text, author, date } = comment;
                date = new Intl.DateTimeFormat(region, dateFormat).format(new Date(date));
                return (
                  <li key={id}>
                    <div>{text}</div>
                    <div>-- {author} , {date}</div>
                    <br />
                  </li>
                )
              })
            }
          </ul>
        </div>
        <CommentForm addComment={addComment} dishId={dishId} />
      </div>
    );
  }
};

const DishDetail = ({ dish, comments, addComment }) => {
  if (dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
            <BreadcrumbItem active><Link to='/menu'>Menu</Link></BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
          </div>
        </div>
        <div className="row">
          <RenderDish dish={dish} />
          <RenderComments
            comments={comments}
            addComment={addComment}
            dishId={dish.id}
          />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}


export default DishDetail;
