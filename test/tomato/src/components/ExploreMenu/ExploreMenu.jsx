/* eslint-disable react/prop-types */
/* eslint_disable react/prop_types */
import style from "./ExploreMenu.module.css";
import { menu_list } from "../../assets/assets";
// eslint_disable_next_line no_unused_vars
const ExploreMenu = ({ setCatagory, catagory }) => {
  return (
    <div className={style.explore_menu} id="explore-menu">
      <h1>Explore Our Menu</h1>
      <div className={style.explore_menu_text}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque, veniam.
        Impedit odit earum saepe! Eligendi quia quo doloremque ratione
        accusamus?
      </div>
      <div className={style.explore_menu_list}>
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCatagory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
            >
              <img
                className={catagory === item.menu_name ? `${style.active}` : ""}
                src={item.menu_image}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
