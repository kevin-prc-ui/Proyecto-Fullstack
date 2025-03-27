import { Transition } from "@headlessui/react";
import ListedUsers from "../../components/Users/ListUsers";

const Users = () => {
  return (
    <>
      <Transition
        as="div"
        appear
        show
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className=""
      >
        <ListedUsers />
      </Transition>
    </>
  );
};

export default Users;