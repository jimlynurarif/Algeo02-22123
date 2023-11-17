// DefaultPagination.jsx

import React from 'react';
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function DefaultPagination({ itemsPerPage, totalItems, setActivePage }) {
  const [active, setActive] = React.useState(1);

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => {
      setActive(index);
      setActivePage(index); // Update the active page in the parent component
    },
  });

  const next = () => {
    if (active === Math.ceil(totalItems / itemsPerPage)) return;
    setActive(active + 1);
    setActivePage(active + 1); // Update the active page in the parent component
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
    setActivePage(active - 1); // Update the active page in the parent component
  };

  return (
    <div className="flex items-center gap-4 py-10 justify-center flex-wrap">
      <Button
        variant="text"
        className="flex items-center gap-2 mb-2 sm:mb-0"
        onClick={prev}
        disabled={active === 1}
        color='green'
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/> Previous
      </Button>
      <div className="flex items-center gap-2">
        {[...Array(Math.ceil(totalItems / itemsPerPage))].map((_, index) => (
          <IconButton key={index} {...getItemProps(index + 1)} color='green' size={index + 1 === active ? 'lg' : 'sm'}>
            {index + 1}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === Math.ceil(totalItems / itemsPerPage)}
        color='green'
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}
