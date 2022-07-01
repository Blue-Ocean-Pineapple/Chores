import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import axios from 'axios';
import AssignStaffForm from './AssignStaffForm';
import AssignStudentForm from './AssignStudentForm';
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Box,
} from '@chakra-ui/react'
import { Select } from "chakra-react-select";


// import Multiselect from 'multiselect-react-dropdown';



export default function AllTickets ({ openTickets, closedTickets, students, staff }) {
  // const [input, setInput] = useState('')
  const [staffOrder, setStaffOrder] = useState([])
  const [studentOrder, setStudentOrder] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [studentVal, setStudentVal] = useState([]);
  const [selected, setSelected] = useState([]);


/**
 *this.state = {
    options: [{name: 'Option 1️, id: 1},{name: 'Option 2️', id: 2}]
};

<Multiselect
options={this.state.options} // Options to display in the dropdown
selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="name" // Property name to display in the dropdown options
/>

 */
  // {value: 'brian', label: "Brian Bui"},
  // vote up and down will use uid
  // how to get lists of ticket upvotes :'(
  const studentFormat = () => {
    let order = [];
    console.log('person', students);
    students.map((person) => {
      // order.i = person.uid
      order.push({value: person.uid, _id: person._id, staffId: person.value, label: person.name})
      // order.push(<div id={students._id} >{students.name}</div>)
    })
    setStudentOrder(order);
    console.log('HELLO', studentOrder);
  }

  const staffFormat = () => {
    let order = [];
    staff.map((person) => {
      // console.log('person', person)
      order.push({value: person.uid, id: person._id, label: person.name})
    })
    setStaffOrder(order);
  }

  useEffect(() => {
    studentFormat();
    staffFormat();
  }, [students, staff])

  const assignTicket = (e) => {

    console.log('EEEEE')
    // console.log('students', students)
    // console.log('staff', staff)
    // console.log('opentickets', openTickets);
    // console.log('closedtickets', closedTickets);

    onClose();
  }

  const updateTicketCall = () => {
    console.log('studentorder', studentOrder);

    onClose();
  }

  // const isError = input === ''

  const handleStatus = (e) => {
    // e.preventDefault();
    console.log('howdy status', e);
    console.log('howdy id?', e.id);

    axios.put('/staff/updateStatus', e)
      .then((response) => {
        console.log('tick update response data:', response);
      })
      .catch((err) => {
        console.log('submit err:', err);
      })
  }

  const handleReopenTicket = (e) => {
    e.preventDefault();
    // console.log('howdy delete?', e.target.getAttribute("id"));
    let obj = closedTickets.find(obj => obj._id === e.target.getAttribute("id"));
    console.log('obj??', obj._id);
    axios.put('/staff/updateReopenTicket', obj)
    .then((response) => {
      console.log('response data:', response);
    })
    .catch((err) => {
      console.log('submit err:', err);
    })
  }


  return (

    <Box bg="#8CC0DE" mt={10} mx="auto"  border="1px solid" borderColor='#8CC0DE' width="90vw" borderRadius="10">
                  {/* <MultiSelect
              options={studentOrder}
              value={value}
              label='Choose or create an item'
              onChange={onChange}
              create
            /> */}
      <TableContainer width="80vw" mx="auto">
        <Heading as='h2' size='xl' mt={10} mb={10}>Open Tickets</Heading>
        <Table variant='striped' >
          <Thead className='opentickets'>
            <Tr variant='striped'>
              <Th>Ticket ID</Th>
              <Th>Task</Th>
              <Th>Customer</Th>
              <Th>Created At</Th>
              <Th>Location</Th>
              <Th>Assigned Staff</Th>
              <Th>Assigned Students</Th>
              <Th>Favorited By</Th>
              <Th>Status</Th>
              <Th>Change Status</Th>
              <Th>Assign Staff</Th>
              <Th>Assign Student</Th>
            </Tr>
          </Thead>

          <Tbody>
          <Tr variant='striped'>
            <Th>1</Th>
            <Th>Async Await</Th>
            <Th>John Ong</Th>
            <Th>06/29/2022</Th>
            <Th>Man Jose</Th>
            <Th>jessica</Th>
            <Th>hansol</Th>
            <Th>hansol</Th>
            <Th>In-Progress</Th>
            <Th>
              <FormControl isRequired>
                <Select
                  options={[
                    {
                      label: "status",
                      options: [
                        {value: 'awaiting', label: "awaiting"},
                        {value: 'approved', label: "approved"},
                        {value: 'in-progress', label: "in-progress"},
                        {value: 'complete', label: "complete"}
                      ]
                    }
                  ]}
                  placeholder="--"
                />
              </FormControl>
            </Th>
            <Th>
              <Button _hover={{ bg: "#9CB4CC" }} onClick={onOpen}>Assign</Button>
            </Th>
            <Th>
              <Button _hover={{ bg: "#9CB4CC" }} onClick={onOpen}>Assign</Button>
            </Th>
            </Tr>
          </Tbody>
            {
              openTickets.map((currentTicket, i) => {
                return (
                  <Tbody key={i}>
                    <Tr variant='striped'>
                      <Th>{currentTicket._id}</Th>
                      <Th>{currentTicket.taskName}</Th>
                      <Th>{currentTicket.clientName}</Th>
                      <Th>{Moment(currentTicket.createdAt).format('MM-DD-YYYY')}</Th>
                      <Th>{currentTicket.address}</Th>
                      <Th>{currentTicket.staffId}</Th>
                      <Th>{currentTicket.studentId}</Th>
                      <Th>{currentTicket.reacts}</Th>
                      <Th>{currentTicket.clientStatus}</Th>
                      <Th>
                        <FormControl isRequired>
                          <Select
                            onChange={(e) => handleStatus(e)}
                            options={[
                              {
                                label: "status",
                                options: [
                                  {value: 'awaiting', label: "awaiting", id: currentTicket._id},
                                  {value: 'approved', label: "approved", id: currentTicket._id},
                                  {value: 'in-progress', label: "in-progress", id: currentTicket._id},
                                  {value: 'complete', label: "complete", id: currentTicket._id}
                                ]
                              }
                            ]}
                            placeholder="--"
                          />
                        </FormControl>
                      </Th>
                      <Th>
                        {/* <Button _hover={{ bg: "#9CB4CC" }} onClick={onOpen} id={currentTicket._id} >Assign</Button> */}
                        {/* <Button onClick={onOpen}>Open Drawer</Button>
                        <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
                          <DrawerOverlay />
                          <DrawerContent>
                            <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
                            <DrawerBody> */}
                              {/* <FormControl p={4}>
                                <FormLabel>
                                  howdy
                                </FormLabel>
                                <Select
                                  isMulti
                                  options={studentOrder}
                                  placeholder="Select some colors..."
                                  closeMenuOnSelect={false}
                                  hasStickyGroupHeaders
                                  // onChange={assignTicket}
                                />
                              </FormControl> */}

                              {/* <select multiple={true} onChange={(e)=> {assignTicket(e.target.selectedOptions)}}>
                                {
                                  students.map((person, i) => {
                                    // order.i = person.uid
                                    return (
                                    <option key={i} value={person._id} >{person.name}</option>
                                    )
                                  })
                                }
                                </select> */}
                        <AssignStaffForm ticket={currentTicket} staffOrder={staffOrder} />
                        </Th>
                        <Th>
                        <AssignStudentForm ticket={currentTicket} studentOrder={studentOrder} />
                      </Th>
                    </Tr>
                </Tbody>
                )
              })
            }
        </Table>

            {/* <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Assign:</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Container mb={16}>
                    <FormControl mb={4} isRequired>
                      <FormLabel>
                        Staff
                      </FormLabel>
                      <Select
                        name="staff"
                        options={[
                          {
                            label: "Staff",
                            options: staffOrder
                          }
                        ]}
                        placeholder="Select student"
                      />
                    </FormControl>

                    <FormControl mb={4} isRequired>
                      <FormLabel>
                        Student
                      </FormLabel>
                      <Select
                        isMulti
                        name="students"
                        options={[
                          {
                            label: "Students",
                            options: studentOrder
                          },
                        ]}
                        placeholder="Select student"
                        closeMenuOnSelect={false}

                      >
                      </Select>
                        <MultiSelect
                          options={options}
                          value={value}
                          label='Choose or create an item'
                          onChange={onChange}
                          create
                        />
                    </FormControl>
                  </Container>
                </ModalBody>

                <ModalFooter>
                  <Button _hover={{ bg: "#9CB4CC" }} variant='ghost' mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button _hover={{ bg: "#9CB4CC" }} colorScheme='blue' onClick={updateTicketCall}>Submit</Button>
                </ModalFooter>
              </ModalContent>
            </Modal> */}



        <Heading as='h2' size='xl' mt={100} mb={5}>Closed Tickets</Heading>
        <Table variant='striped'>
          <Thead className='tickets'>
            <Tr variant='striped'>
              <Th>Ticket ID</Th>
              <Th>Customer</Th>
              <Th>Assigned Staff</Th>
              <Th>Assigned Students</Th>
              <Th>Reopen Ticket</Th>
            </Tr>
          </Thead>
            {
              closedTickets.map((currentTicket, i) => {
                return (
                  <Tbody key={i}>
                    <Tr variant='striped'>
                      <Th>{currentTicket._id}</Th>
                      <Th>{currentTicket.clientName}</Th>
                      <Th>{currentTicket.staffId}</Th>
                      <Th>{currentTicket.studentId}</Th>
                      <Th>
                        <Button _hover={{ bg: "#9CB4CC" }} id={currentTicket._id} onClick={(e) => handleReopenTicket(e)}>Open</Button>
                      </Th>
                    </Tr>
                  </Tbody>
                )
              })
            }

        </Table>
      </TableContainer>
    </Box>
  )
}


// db.tickets.insertOne({ uid: "3RzRikHOkAZhsib4tje4USZs9d93", name: "wow", email: "acoolguy@test.com", age: 22, address: "555 cool street", city: "vegas wooo", state: "vegas", phone: "394857283", role: "Staff", organization: "sesameeeee", active: "false"});

// {
//   "coordinates": {
//       "lat": 34.041451,
//       "lng": -118.232719
//   },
//   _id: "3RzRikHOkAZhsib4tje4USZs9d93",
//   clientName: "wow",
//   taskName: "lawn mow",
//   description: "mow mow",
//   address: "500 Mateo St, Los Angeles, CA 90013",
//   clientStatus: "complete",
//   creatorId: "4",
//   reacts: [],
//   studentId: null,
//   staffId: null,
//   complete: true,
//   createdAt: "2022-06-29T22:46:54.041Z",
//   __v: 0
// }