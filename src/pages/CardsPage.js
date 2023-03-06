import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import { questionsById } from "../questions";

import api from "../api";

import { BsFlower1 } from "react-icons/bs";
import { BsFillPersonCheckFill } from "react-icons/bs";

import maleImg from "../assets/male_avatar.png";
import femaleImg from "../assets/female_avatar.png";

function CardsPage() {
  const { reloadUsersCounter } = useGlobalContext();
  const { activeUser, setActiveUser } = useGlobalContext();

  const [activeUserToBe, setActiveUserToBe] = useState(activeUser);
  const [usersData, setUsersData] = useState();
  const [selectedGender, setSelectedGender] = useState([]);

  // useEffect(() => {
  const handleRemoveBtn = async (userId) => {
    try {
      let respond = await api.delete(`./users/${userId}`);
      console.log(respond.data);
      setUsersData(usersData.filter((item) => item.id !== userId));
    } catch (error) {
      console.log("ERROR!");
    }
  };
  // }, []);

  useEffect(() => {}, [usersData]);

  useEffect(() => {
    // We want to reload users for each change of the counter
    reloadUsersCounter?.toString();
    const getData = async () => {
      try {
        let respond = await api.get("/users");
        setUsersData(respond.data);
      } catch (error) {
        console.log("ERROR!");
      }
    };
    getData();
  }, [reloadUsersCounter]);

  function filteredOptions(e) {
    if (e.target.value === "All") {
      setSelectedGender(usersData);
      return;
    }
    const filterData = usersData.filter(
      (userGender) => userGender.gender === e.target.value
    );
    console.log(filterData);
    setSelectedGender(filterData);
  }

  useEffect(() => {
    setSelectedGender(usersData);
  }, [usersData]);

  return (
    <div className="page cards-page">
      <div className="hobbies-title-div container-users-title">
        <h2 className="users-title">ALL USERS</h2>
        <span>Filter:</span>
        <select name="gender" onChange={(e) => filteredOptions(e)}>
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <input
        type="number"
        value={activeUserToBe}
        onChange={(e) => setActiveUserToBe(e.target.value)}
      />
      <button
        onClick={() => {
          setActiveUser(activeUserToBe);
        }}
      >
        Set Active User
      </button>

      <div className="cards-container">
        {selectedGender?.map((item, index) => {
          return (
            <div key={index} className="card">
              <div>
                {item.gender === "Male" ? (
                  <img src={maleImg} alt="male" className="icon" />
                ) : (
                  <img src={femaleImg} alt="female" className="icon" />
                )}
              </div>
              <div className="cards-items-container">
                <div className="card-items card-title">Personal Details:</div>
                <div className="card-items">{item.fullName}</div>
                <div className="card-items">{item.age}</div>
                <div className="card-items">{item.gender}</div>
                <div className="card-items">{item.status}</div>
                <div className="card-items">Smoking: {item.smoking}</div>
                <div className="card-items card-title">Hobbies:</div>
                <div className="card-items hobbies-answers ">
                  {item.trivia?.map((q) => (
                    <p>
                      {/* {questionsById[q].title}: {questionsById[q].correctAnswer} */}
                      {questionsById[q].subject}
                    </p>
                  ))}
                </div>
              </div>
              {/* <div className="card-btn-container"> */}
              <button
                className="card-btn"
                onClick={() => handleRemoveBtn(item.id)}
              >
                REMOVE USER
              </button>
              {/* </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardsPage;
