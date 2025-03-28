/* eslint-disable react/prop-types */
import { useState } from 'react';
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import  linkData  from '../../assets/routes';

const Sidebar = () => {
  const [expandedParent, setExpandedParent] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, linkData.length);
  const toggleParent = (parentLabel) => {
    setExpandedParent(prev => prev === parentLabel ? null : parentLabel);
  };

  // Updated active link check
  const isActiveLink = (link) => {
    return location.pathname.startsWith(link);
  };
  return (
  <Container fluid className="h-100 p-3">
    <Navbar expand="lg" className="flex-column h-100">
      <Nav className="flex-column flex-grow-1 w-full">
        {sidebarLinks.map((parent) => (
          <div key={parent.label} className="w-full">
            {/* Parent Link */}
            <div
              className={clsx(
                "w-full flex gap-2 px-3 py-2 rounded items-center mb-2",
                "text-decoration-none cursor-pointer",
                parent.children?.some(child => location.pathname.includes(child.link))
                  ? "bg-primary text-white"
                  : "text-dark hover:bg-[#2564ed2d]"
              )}
              onClick={() => toggleParent(parent.label)}
            >
              <span className="fs-5">{parent.icon}</span>
              <span className="fs-6">{parent.label}</span>
            </div>

            {/* Animated Child Links */}
            {expandedParent === parent.label && (
              <div className="child-links ms-4 ps-2 border-start">
                {parent.children?.map((child, index) => (
                  <Link
                    key={child.label}
                    to={child.link}
                    className={clsx(
                      "child-link",
                      "w-full lg:w-8/9 flex gap-2 px-3 py-2 rounded items-center mb-2",
                      "text-decoration-none hover:bg-[#2564ed2d] min-w-40",
                      isActiveLink(child.link)
                        ? "bg-primary text-white"
                        : "text-dark"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="fs-5">{child.icon}</span>
                    <span className="fs-6">{child.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Settings Section */}
        <div className="w-100 border-top pt-3 mt-auto">
          <Button
            variant=""
            className="text-dark d-flex align-items-center gap-2 w-100">
            <MdSettings className="fs-5" />
            <span className="fs-6">Settings</span>
          </Button>
        </div>
      </Nav>
    </Navbar>
  </Container>
);
};

export default Sidebar;