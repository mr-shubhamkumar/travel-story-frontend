import React, { useState } from "react";
import { MdAdd, MdClose, MdDelete, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/input/DateSelector";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";

import moment from "moment";
import { toast } from "react-toastify";

function AddEditTravelStory({ storyInfo, type, onClose, getAllTravelStories }) {
  const [error, setError] = useState("");
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );

  // Add New Travel Story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image URL
        imageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");

        // Refresh stories
        getAllTravelStories();
        // Close modal or form
        onClose();
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

  // Update Travel story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation, 
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };
      console.log(postData);
      

      if (typeof storyImg === "object") {
        // Upload new image
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        
        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
        
      }
     
      const response = await axiosInstance.put(
        "/edit-stories/" + storyId,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        // Refresh stories
        getAllTravelStories();
        // Close modal or form
        onClose();
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
  const handleAddOrUpdateClick = () => {
    console.log("Input Data", {
      title,
      storyImg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!story) {
      setError("Please enter the title");
      return;
    }
    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  // Delete story image and update the story
  const handleDeleteImg = async () => {
    const deleteImgReg = await axiosInstance.delete("delete-image",{
      params:{
        imageUrl:storyInfo.imageUrl
      }
    })

    if (deleteImgReg.data) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl:"",
      }
      const response = await axiosInstance.put( "/edit-stories/" + storyId,
        postData);
        setStoryImg(null)
    }
  };


  return (
    <>
      <div className="relative">
        <div className="flex item-center justify-between">
          <h5 className="text-xl font-medium text-slate-700">
            {type === "add" ? "Add Story" : "Update Story"}
          </h5>

          <div className="">
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg ">
              {type === "add" ? (
                <button
                  className="btn-small"
                  onClick={() => {
                    handleAddOrUpdateClick();
                  }}
                >
                  <MdAdd className="text-lg" />
                  Add Story
                </button>
              ) : (
                <>
                  <button
                    className="btn-small"
                    onClick={() => {
                      handleAddOrUpdateClick();
                    }}
                  >
                    <MdUpdate className="text-lg" />
                    Update Story
                  </button>
                </>
              )}

              <button className="" onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex-1 flex flex-col gap-2 pt-4">
            <label className="input-label">TITLE</label>
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              type="text"
              className="text-2xl text-slate-950 outline-none"
              placeholder="A Day at the Great Wall"
            />
          </div>
          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>
        </div>

        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteImg}
        />

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Story</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
            placeholder="Your Story"
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        <div className="pt-3">
          <label className="input-label">VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </>
  );
}

export default AddEditTravelStory;
