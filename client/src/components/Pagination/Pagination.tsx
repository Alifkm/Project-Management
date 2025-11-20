import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxPerPage: number;
  onPageChange: (page: number) => void;
  items: any[];
}
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = [];

  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  // Generate page buttons
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <IconButton
        key={i}
        variant={currentPage === i ? "filled" : "outlined"}
        color="black"
        onClick={() => handleClick(i)}
        {...({} as any)}
      >
        {i}
      </IconButton>
    );
  }

  return (
    <div className="flex self-end justify-center h-full gap-4">
      {/* Previous */}
      <Button
        variant="text"
        className="flex items-center gap-4"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        {...({} as any)}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-5">{pages}</div>

      {/* Next */}
      <Button
        variant="text"
        className="flex items-center gap-4 rounded-full"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        {...({} as any)}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;