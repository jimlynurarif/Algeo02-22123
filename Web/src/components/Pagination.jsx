// DefaultPagination.jsx

import React from 'react';
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// ... (your imports remain the same)

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

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 10) {
      return [...Array(totalPages)].map((_, index) => (
        <IconButton key={index} {...getItemProps(index + 1)} color='green' size={index + 1 === active ? 'lg' : 'sm'}>
          {index + 1}
        </IconButton>
      ));
    } else {
      const pages = [];
      const visiblePages = 7; // Adjust as needed

      if (active <= visiblePages - 3) {
        // Display pages from 1 to visiblePages
        for (let i = 1; i <= visiblePages - 1; i++) {
          pages.push(
            <IconButton key={i} {...getItemProps(i)} color='green' size={i === active ? 'lg' : 'sm'}>
              {i}
            </IconButton>
          );
        }
        pages.push(<span key="ellipsis1">...</span>);
        pages.push(
          <IconButton key={totalPages} {...getItemProps(totalPages)} color='green' size={totalPages === active ? 'lg' : 'sm'}>
            {totalPages}
          </IconButton>
        );
      } else if (active >= totalPages - visiblePages + 4) {
        // Display pages from totalPages - visiblePages + 3 to totalPages
        pages.push(
          <IconButton key={1} {...getItemProps(1)} color='green' size={1 === active ? 'lg' : 'sm'}>
            1
          </IconButton>
        );
        pages.push(<span key="ellipsis2">...</span>);
        for (let i = totalPages - visiblePages + 4; i <= totalPages; i++) {
          pages.push(
            <IconButton key={i} {...getItemProps(i)} color='green' size={i === active ? 'lg' : 'sm'}>
              {i}
            </IconButton>
          );
        }
      } else {
        // Display pages around the active page
        pages.push(
          <IconButton key={1} {...getItemProps(1)} color='green' size={1 === active ? 'lg' : 'sm'}>
            1
          </IconButton>
        );
        pages.push(<span key="ellipsis3">...</span>);
        for (let i = active - 1; i <= active + 1; i++) {
          pages.push(
            <IconButton key={i} {...getItemProps(i)} color='green' size={i === active ? 'lg' : 'sm'}>
              {i}
            </IconButton>
          );
        }
        pages.push(<span key="ellipsis4">...</span>);
        pages.push(
          <IconButton key={totalPages} {...getItemProps(totalPages)} color='green' size={totalPages === active ? 'lg' : 'sm'}>
            {totalPages}
          </IconButton>
        );
      }

      return pages;
    }
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
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
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
