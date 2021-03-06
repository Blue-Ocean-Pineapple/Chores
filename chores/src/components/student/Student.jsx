import React, { useState, useEffect } from "react";
import axios from "axios";
import Ticket from "./Ticket.jsx";
import StudentTicket from "./StudentTicket.jsx";
import ClosedStudentTicket from "./ClosedStudentTicket.jsx";
import TicketModal from "./TicketModal.jsx";
//import { BsHandThumbsUp, BsHandThumbsDown, BsCheckLg } from "react-icons/bs";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

export default function Student(props) {
  // useEffect axios call
  const { currentUser } = useAuth();

  // const handleLogin = async (e) => {
  //   try {
  //     const res = await axios.get(’http://localhost:3001/api/users/'+ email);
  //     console.log(‘HIT GET USER from User Database’, res.data);
  //     navigate(‘/’+ res.data.role.toLowerCase())
  //   } catch(err) {
  //     console.log(‘Error while getting user info’, err)
  //   }
  // }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalInfo, setModalInfo] = useState({});
  const [studentTicket, setStudentTicket] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);

  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [showAllTickets, setShowAllTickets] = useState(true); // if false shows assigned
  const [showOpenTickets, setShowOpenTickets] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOpenTickets(),
      fetchClosedTickets(),
      fetchAssignedTickets(),
    ])
      .then((results) => {
        setAllTickets(results[0].data);
        setClosedTickets(results[1].data);
        setStudentTicket(results[2].data);
      })
      .catch((err) => console.log(err, "Error in promise all"));
  }, []);

  const fetchOpenTickets = () => {
    return axios.get(`http://localhost:3001/api/student/ticket/open`);
  };

  const fetchClosedTickets = () => {
    return axios.get(
      `http://localhost:3001/api/student/${studentId}/ticket/closed`
    );
  };

  const fetchAssignedTickets = () => {
    return axios.get(
      `http://localhost:3001/api/student/${studentId}/ticket/open`
    );
  };

  const voteUpTicket = (ticketId) => {
    axios
      .put(`http://localhost:3001/api/student/ticket/voteUp`, {
        studentId: studentId,
        ticketId: ticketId,
      })
      .then((results) => {
        console.log(results);
      })
      .catch((err) => console.log(err));
  };

  const voteDownTicket = (ticketId) => {
    // Will remove their Id from the array
    axios
      .put(`http://localhost:3001/api/student/ticket/voteDown`, {
        studentId: studentId,
        ticketId: ticketId,
      })
      .then((results) => {
        console.log(results);
      })
      .catch((err) => console.log(err));
  };

  const handleOpenButton = () => {
    setShowOpenTickets(!showOpenTickets);
  };

  const handleAllTickets = () => {
    setShowAllTickets(!showAllTickets);
  };

  useEffect(() => {
    if (showOpenTickets === false) {
      setShowAllTickets(false);
    }
  }, [showOpenTickets]);

  useEffect(() => {
    if (showAllTickets === true) {
      setShowOpenTickets(true);
    }
  }, [showAllTickets]);

  const handleModalTicket = (info) => {
    onOpen();
    console.log(info);
    setModalInfo(info);
  };

  return currentUser ? (
    <Box maxWidth="70%" m="auto">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Button
            colorScheme={showOpenTickets ? "blue" : "gray"}
            onClick={handleOpenButton}
          >
            Open Tickets
          </Button>
          <Button
            colorScheme={showOpenTickets ? "gray" : "blue"}
            onClick={handleOpenButton}
          >
            Closed Tickets
          </Button>
        </Box>
        <Box>
          <Button
            colorScheme={showAllTickets ? "red" : "gray"}
            onClick={handleAllTickets}
          >
            All Tickets
          </Button>
          <Button
            colorScheme={showAllTickets ? "gray" : "red"}
            onClick={handleAllTickets}
          >
            Assigned Tickets
          </Button>
        </Box>
      </Box>

      <Box overflowY="auto" maxH="500px" boxShadow="base">
        <TableContainer maxH="60%" overflowY="scroll">
          <Table variant="simple" size="sm">
            <TableCaption placement="top">Student's Tickets</TableCaption>
            {showAllTickets && showOpenTickets && (
              <Thead>
                <Tr>
                  <Th>Task Name</Th>
                  <Th>Owner of Ticket</Th>
                  <Th>Location</Th>
                  <Th>Wage</Th>
                  {/* <Th>Created At</Th> */}
                  <Th textAlign="center">Vote</Th>
                </Tr>
              </Thead>
            )}
            {showOpenTickets && !showAllTickets && (
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Task Name</Th>
                  <Th>Owner of Ticket</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  {/* <Th textAlign="center">Completed</Th> */}
                </Tr>
              </Thead>
            )}

            {!showAllTickets && !showOpenTickets && (
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Task Name</Th>
                  <Th>Owner of Ticket</Th>
                  <Th>Location</Th>
                  <Th>Wage</Th>
                  <Th textAlign="center">Completed</Th>
                </Tr>
              </Thead>
            )}

            <Tbody>
              {!showAllTickets &&
                showOpenTickets &&
                studentTicket.map((ticket, index) => (
                  <StudentTicket ticket={ticket} index={index} />
                ))}

              {showAllTickets &&
                showOpenTickets &&
                allTickets.map((ticket, index) => (
                  <Ticket
                    handleModalTicket={handleModalTicket}
                    ticket={ticket}
                    voteDownTicket={voteDownTicket}
                    voteUpTicket={voteUpTicket}
                    index={index}
                    studentId={currentUser.uid}
                  />
                ))}

              {!showAllTickets &&
                !showOpenTickets &&
                closedTickets.map((ticket, index) => (
                  <ClosedStudentTicket ticket={ticket} />
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <TicketModal
        ticket={modalInfo}
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  ) : null;
}

// <Tr>
// <Td>Finding My Cat</Td>
// <Td>Christy Lopez</Td>
// <Td>San Jose</Td>
// <Td>6/29 at 4:15 PM</Td>
// <Td>2313</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="gray">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
// <Tr>
// <Td>Mowing the Lawn</Td>
// <Td>Brian Bui</Td>
// <Td>San Jose</Td>
// <Td>6/28 at 6:00 PM</Td>
// <Td>8347</Td>
// <Td display="flex" justifyContent="space-around">
//   <Button colorScheme="blue">
//     <BsHandThumbsUp />
//   </Button>
//   <Button colorScheme="red">
//     <BsHandThumbsDown />
//   </Button>
// </Td>
// <Td textAlign="center">
//   <Button colorScheme="green">
//     <BsCheckLg />
//   </Button>
// </Td>
// </Tr>
