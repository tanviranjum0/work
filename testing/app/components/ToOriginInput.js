"use client";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import SearchItem from "./molecule/SearchItem";
import { StoreContext } from "../context/StoreContextMain";
import { useContext } from "react";

const ToOriginInput = () => {
  const { handleSearchChangeToOrigin, searchToLoader, searchData, error } =
    useContext(StoreContext);
  return (
    <div
      id="searchFormToOrigin"
      className={`absolute hidden z-20 inset-0 backdrop-blur`}
    >
      <motion.div
        key={"tooriginalinput"}
        initial={{
          scale: 0.8,
          opacity: 0,
          skewX: 5,
        }}
        whileInView={{
          scale: 1,
          opacity: 1,
          skewX: 0,
        }}
        transition={{
          duration: 0.1,
          type: "spring",
          stiffness: 50,
        }}
        className="flex justify-center h-screen w-screen inset-0 items-center"
      >
        <div className="w-[90vw] py-5 bg-sky-50 md:w-[40vw] shadow-2xl">
          <div className="relative">
            <HiMiniXMark
              onClick={() => {
                document
                  .getElementById("searchFormToOrigin")
                  .classList.toggle("hidden");
              }}
              className="absolute top-0 right-0 mr-3 cursor-pointer text-3xl"
            />
          </div>
          <div className="relative">
            <div className="absolute top-2 right-20 mr-3 cursor-pointer ">
              <FaSearch
                onClick={() => handleSearchChangeToOrigin()}
                className="text-2xl"
              />
            </div>
          </div>
          <input
            id="searchInputToOrigin"
            placeholder="To Where..."
            className="text-lg py-3 mb-3 px-4 mx-4 w-[80%] focus:outline-none focus:border-b-2 bg-inherit border-b-2"
          />

          <div className="w-[95%] mx-auto  my-3">
            {searchToLoader && (
              <div className="flex justify-center items-center">
                <div
                  style={{
                    position: "relative",
                    width: 50,
                    height: 50,
                  }}
                >
                  <motion.span
                    key={"tosearchloader"}
                    style={{
                      opacity: 2,
                      display: "block",
                      width: 50,
                      height: 50,
                      border: "7px solid #eee",
                      borderTop: "7px solid #2D3134",
                      borderRadius: "50%",
                      boxSizing: "border-box",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      ease: "easeInOut",
                      duration: 1,
                    }}
                  />
                </div>
              </div>
            )}
            {error ? error : null}
            {!searchData || searchData.data == [null] ? (
              <div className=" w-full hover:bg-sky-400/30 rounded  px-3 relative flex py-2">
                <div className="text-sm">No Data , Search </div>
              </div>
            ) : (
              searchData.map((data, ind) => {
                if (data.subType == "AIRPORT") {
                  return (
                    <SearchItem
                      key={`${ind} laralappa `}
                      data={data}
                      origin={"to"}
                    />
                  );
                }
              })
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ToOriginInput;
