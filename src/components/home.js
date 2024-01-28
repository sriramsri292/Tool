import { Link } from 'react-router-dom';
import React,{useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useCart } from "../cartext";
import Button from 'react-bootstrap/Button';
import '../styles/home.css';
import Table from 'react-bootstrap/Table';


import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
} from 'mdb-react-ui-kit';
import Map from "./map";



export default function Home(){
  const {
    setForm,
    // ... other state variables from useCart
  } = useCart();

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Collect data from form inputs
    const formData = {
      origin: e.target.elements.Origin.value,
      destination: e.target.elements.Destination.value,
      waypoint: e.target.elements.waypoint.value,
      
      time: e.target.elements.time.value,
      // ... other form fields
    };
    
  
    console.log("Form Data:", formData); // Log form data
  
    // Update the form state in the context
    setForm(formData);
  
    
  };

  const {
    origin,
    destination,
   
    form,
    responseData,
    setResponseData,
    data,
    setData
    
  } = useCart();

  const originAddress = useCart().originAddress;
  
  const destinationAddress = useCart().destinationAddress;
  


  console.log('data.route.tolls:', data?.route?.tolls)

  console.log("poly", responseData?.routes?.[0]?.polyline);


useEffect(() => {

  let isMounted = true; // Track if the component is mounted

  const backend = async () => {
    try {
      console.log('Sending request to backend...');

      const payload = {
        polyline: responseData?.routes?.[0]?.polyline,
      };

      console.log('Request payload:', JSON.stringify(payload));

      const response = await fetch('https://toolapi.onrender.com/tool/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok && isMounted) {
        const data = await response.json();
        console.log('Response from backend:', data);
        setData(data);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error sending request to backend:', error);
    }
  };

  // Call backend function whenever responseData is updated
  if (responseData && isMounted) {
    backend();
  }

  // Cleanup function to set isMounted to false when the component is unmounted
  return () => {
    isMounted = false;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [responseData]);



const handleButtonClick = () => {
  if (destinationAddress && originAddress) {
    sendRequestToBackend();
  }
};

const sendRequestToBackend = async () => {
  try {
    console.log('Sending request to backend...');

    const payload = {
      from: {
        address: originAddress,
        lat: origin[0],
        lng: origin[1],
      },
      to: {
        address: destinationAddress,
        lat: destination[0],
        lng: destination[1],
      },
      waypoints: form.waypoint ? [{ address: form.waypoint }] : [],
      serviceProvider: 'here',
      vehicle: {
        type:  '2AxlesAuto',
        weight: {
          value: 20000,
          unit: 'pound',
        },
        height: {
          value: 7.5,
          unit: 'meter',
        },
        length: {
          value: 7.5,
          unit: 'meter',
        },
        axles: 4,
        emissionClass: 'euro_5',
      },
    };

    console.log('Request payload:', JSON.stringify(payload));

    const response = await fetch('https://toolapi.onrender.com/tool/api/tollguru/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'DqJ3mP9LQ7B3nnTDJ4JjDdfDG444LLqJ',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
        console.log('Response from backend calc:', data);

        // Set the response data to the state
        setResponseData(data);
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending request to backend:', error);
  }
};

console.log("data form state ",data);

console.log("the",data?.route?.distance?.metric);



    return (
        <div className="Ha"> 
        <div> 

        <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://media.istockphoto.com/id/1032162888/vector/world-travel.webp?s=612x612&w=is&k=20&c=P22imYWbDSyBY6_42d7Zoc8ogUcU0IcxHbRFthE3nok="
              width="80"
              height="80"
              className="d-inline-block align-top"
            />{' '}
            <h3 style={{display:'inline',fontFamily:'fantasy'}}> Toll Calc</h3>
          </Navbar.Brand>
          <Button variant="outline-secondary">
     <Link to='/tutorial'> 
          <Navbar.Brand >
           
            <h3 style={{display:'inline',fontFamily:'fantasy'}}> Tutorial Page</h3>
          </Navbar.Brand>
          </Link>
          </Button>{' '}
        </Container>
      </Navbar>
        </div>

<div> 
<Button className="button" onClick={handleButtonClick} variant="success">Click To Calculate Tolls</Button>{' '}
    <Container > 
    
   
      <Row>
        <Col >
        <Form onSubmit={handleFormSubmit}>
      <MDBContainer fluid={true}>
        <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                <div className='d-flex flex-row align-items-center mb-4'>
                  <MDBIcon fas icon='user me-3' size='lg' />
                  <MDBInput label='Origin' id='form1' type='text' className='w-100' name="Origin" />
                </div>

                <div className='d-flex flex-row align-items-center mb-4'>
                  <MDBIcon fas icon='envelope me-3' size='lg' />
                  <MDBInput label='Destination' id='form2' type='text' name="Destination" />
                  <img width="50" height="50" src="https://img.icons8.com/external-creatype-flat-colourcreatype/64/external-destination-maps-and-navigation-creatype-flat-colourcreatype.png" alt="external-destination-maps-and-navigation-creatype-flat-colourcreatype" />
                </div>

                <div className='d-flex flex-row align-items-center mb-4'>
                  <MDBIcon fas icon='user me-3' size='lg' />
                  <MDBInput label='WayPoint' id='waypoint' type='text' className='w-100' name="waypoint" />
                </div>

              

                

                <div className='d-flex flex-row align-items-center mb-4'>
                  <MDBIcon fas icon='user me-3' size='lg' />
                  <MDBInput label='Departure Time' id='time' type="datetime-local" className='w-100' name="time" />
                </div>
                <div className='mb-4'>
                  <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Verify Details' />
                </div>

                <MDBBtn id="submit-button" className='mb-4' size='lg' type="submit">
                 Search Address
                </MDBBtn>
                
              </MDBCol>

              <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </Form>
        
        
   
        
        
        
        
        
        </Col>
        <Col xs={6} style={{ overflow: 'auto' }}>
     
        <Map/>
       
       
</Col>
        </Row>
      </Container>
</div>


<div> 

</div>









          
<Table striped bordered hover size="sm" className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Minimum Toll coast</th>
          <th>Diatance</th>
          <th>Has tolls</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>{data?.route?.costs?.minimumTollCost}</td>
          <td>{data?.route?.distance?.metric}</td>
          <td>{data?.route?.hasTolls ? "Yes" : "No"}</td>


        </tr>
       
      </tbody>
    </Table>





        </div>
    )
}