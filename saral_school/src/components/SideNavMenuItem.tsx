import { IconType } from "react-icons/lib";
import classNames from "classnames";

export default function SideNavMenuItem({
	icon,
	text,
	selectItem,
	selected,
}: {
	icon: React.ReactNode;
	text: React.ReactNode;
	selectItem: any;
	selected: boolean;
}) {
	const iconClass = classNames("size-5");
	const menuItemClass = classNames(
		"flex items-end space-x-2 cursor-pointer h-10 rounded-md hover:underline p-2 mb-1 font-medium",
		{
			"bg-slate-200": selected,
		}
	);
	return (
		<a className={menuItemClass} onClick={selectItem}>
			{icon}
			<p>{text}</p>
		</a>
	);
}
