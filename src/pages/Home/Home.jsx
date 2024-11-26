import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
import TravelStoryCard from "../../components/Card/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "../../components/input/ViewTravelStory";
import { FaInbox } from "react-icons/fa";
import EmptyCard from "../../components/input/EmptyCard";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import moment from "moment";
import FilerInfoTitle from "../../components/input/FilerInfoTitle";


function Home() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState();

  const [dateRange, setdateRange] = useState({from:null , to:null})

  const [filterType, setFilterType] = useState('');

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  // console.log("searchQuery"), searchQuery;

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      const data = response.data.user;
      if (data) {
        setUserInfo(data);
      }
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // Get All travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      const data = response.data.stories;
      if (data) {
        setAllStories(data);
      }
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // Handle edit story click
  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // Handle View Story click
  const handleViewStory = async (data) => {
    setOpenViewModal({ isShown: true, data: data });
  };

  // Handle update IsFavourite click
  const updateIsFavourite = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !data.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        getAllTravelStories();
        toast.success("Favorite Story Added");
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  //Delete Story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-stories/" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    }
  };

  // Search Story
  const onSearchNote = async (query) =>{
    try {
      const response = await axiosInstance.get("/search",{
        params:{
          query
        }
      });

      if (response.data && response.data.stories) {
        setFilterType("search")
        setAllStories(response.data.stories)
      }
      
    } catch (error) {
     
        console.log("An unexpected error occurred. Please try again");
      
    }
  }
  const  handleClearSearch =  () =>{
    setFilterType("search")
    getAllTravelStories()
  }

const filterStoryByDate = async (day) =>{
  try {
    const startDate = day.from ? moment(day.from).valueOf() : null
    const endDate = day.to ? moment(day.to).valueOf() : null

    if (startDate && endDate) {
      const response = await axiosInstance.get('/travel-stories/filter',{
        params:{
          startDate, endDate
        }
      })

      if (response.data && response.data.stories) {
        setFilterType("date")
        setAllStories(response.data.stories)
      }
    }
  } catch (error) {
    
  }
}
  const handleDayClick = (day)=>{
    setdateRange(day)
    filterStoryByDate(day)
  }

  const resetFilter = ()=>{
    setdateRange({from:null, to:null})
    setFilterType("")
    getAllTravelStories()
  }
  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto ">
        <FilerInfoTitle

        filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{
          resetFilter()
        }}
        />
      </div>

      <div className="container mx-auto py-10">
        <div className="flex gap-4">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      isVisitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <EmptyCard 
                 />
              </>
            )}
          </div>
          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
            <div className="p-3">
              <DayPicker  
              captionLayout="dropdown-buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation
              />
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit Travel Story Model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgb(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Travel Story Model */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgb(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          type={openViewModal.type}
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onEditDelete={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
}

export default Home;
