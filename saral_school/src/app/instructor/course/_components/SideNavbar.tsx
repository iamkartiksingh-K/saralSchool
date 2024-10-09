import { MdOutlinePersonalVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import SideNavMenuItem from "./SideNavMenuItem";
import type { Dispatch, SetStateAction } from "react";
import { User } from "lucide-react";
import { Library } from "lucide-react";
export default function SideNavbar({
  setOption,
  selected,
}: {
  setOption: Dispatch<SetStateAction<string>>;
  selected: string;
}) {
  const select = (value: string) => {
    setOption(value);
  };
  return (
    <div className="flex flex-col md:52 lg:w-64 border-r-2 p-1">
      <SideNavMenuItem
        selectItem={() => select("instructorCourse")}
        text="Courses"
        icon={<Library />}
        selected={selected === "instructorCourse"}
      />
      <SideNavMenuItem
        selectItem={() => select("editProfile")}
        text="Profile"
        icon={<User />}
        selected={selected === "editProfile"}
      />
    </div>
  );
}
