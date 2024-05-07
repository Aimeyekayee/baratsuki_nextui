import { users } from "@/asset/member_data/data";
import { Avatar, ScrollShadow } from "@nextui-org/react";
import React from "react";

const ListBoxMember = () => {
  return (
    <ScrollShadow className="grid grid-cols-3 gap-2 overflow-y-auto max-h-40">
      {users.map((item) => {
        const nameParts = item.name.split(" ");
        const firstName = nameParts[0];
        const lastNameInitial =
          nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + "." : "";

        return (
          <div
            key={item.id}
            className="p-4 rounded flex items-center border border-gray-200"
          >
            <Avatar
              alt={item.name}
              className="flex items-center justify-center"
              size="sm"
              src={item.avatar}
            />
            <div className="flex flex-col mt-2">
              <span className="text-small">{`${firstName} ${lastNameInitial}`}</span>
              <span className="text-tiny text-default-400">{item.role}</span>
            </div>
          </div>
        );
      })}
    </ScrollShadow>
  );
};

export default ListBoxMember;
