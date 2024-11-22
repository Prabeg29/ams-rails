import { ReactNode } from "react";
import { Link } from "react-router";
import { MdDashboard } from "react-icons/md";
import { FiMusic, FiStar, FiUsers } from "react-icons/fi";


import { Role } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { classname } from "../../utils/common";

export interface NavItem {
	label: string;
	to: string;
	icon: ReactNode;
	minAuthLevel: Role;
	maxAuthLevel: Role;
};

export const NavBar = () => {
	const { user } = useAuth();

  const navItems: NavItem[] = [
		{
			label: "Dashboard",
			to: "/",
			icon: <MdDashboard size={20} />,
			minAuthLevel: "artist",
			maxAuthLevel: "super_admin",
		},
		{
			label: "Users",
			to: "/users",
			icon: <FiUsers size={20} />,
			minAuthLevel: "super_admin",
			maxAuthLevel: "super_admin",
		},
		{
			label: "Artists",
			to: "/artists",
			icon: <FiStar size={20} />,
			minAuthLevel: "artist_manager",
			maxAuthLevel: "super_admin",
		},
		{ 
      label: "Songs",
      to: "/songs",
      icon: <FiMusic size={20} />,
      minAuthLevel: "artist",
      maxAuthLevel: "artist"
    },
	];

  return (
		<div className="flex flex-col w-full gap-1 mt-1">
			{navItems
				.filter((item) => user?.role >= item.minAuthLevel && user?.role <= item.maxAuthLevel)
				.map((item, index) => (
					<NavBarLink
						key={index}
						to={item.to}
						label={item.label}
						icon={item.icon}
						isActive={location.pathname === item.to}
					/>
				))}
		</div>
	);
};

interface NavBarLinkProps {
	to: string;
	label: string;
	icon: ReactNode;
	isActive: boolean;
}

const NavBarLink: React.FC<NavBarLinkProps> = ({ to, label, icon, isActive }) => {
	return (
		<Link
			to={to}
			className={classname("flex gap-3 p-2 content-center items-center border-l-4 transition-colors duration-200", {
				"pointer-events-none border-l-blue-500 bg-blue-100 font-semibold": isActive,
				"hover:bg-gray-200 border-l-transparent": !isActive,
			})}
		>
			{icon}
			<p className="text-sm">{label}</p>
		</Link>
	);
};
