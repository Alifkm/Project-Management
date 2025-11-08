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

// const Pagination = ({currentPage, totalPages, maxPerPage, onPageChange, items}: PaginationProps) => {
//   const [active, setActive] = useState(1);
//   const pages = [];

//   // useEffect(() => {
//   //   setActive(currentPage);
//   // }, [currentPage]);

//   const getItemProps = (index: number) => ({
//     variant: active == index ? "filled" : "text",
//     color: "navy",
//     onClick: () => handlePageClick(index),
//   } as any);

//   const next = () => {
//     if(active < totalPages) handlePageClick(active + 1); 
    
//     setActive(active + 1);
//   }

//   const prev = () => {
//     if (active > 1) handlePageClick(active - 1);
//   }

//   for(let i = 1; i <= totalPages; i++) {
//     pages.push(<IconButton key={i} {...getItemProps(i)}>{i}</IconButton>)
//   }

//   const handlePageClick = (page: number) => {
//     setActive(page);
//     onPageChange(page);
//   }

//   return (
//     <div className="flex items-end justify-around gap-4 h-full mb-4">
//       <Button
//         variant="text"
//         className="flex items-center gap-2 rounded-full"
//         onClick={prev}
//         disabled={active === 1}  
//         {...({} as any)}
//         >
//           <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
//           Previous
//       </Button>

//       <div className="flex items-center gap-4 mb-4">
//         {pages}
//       </div>

//       <Button
//         variant="text"
//         className="flex items-center gap-2 rounded-full"
//         onClick={next}
//         disabled={active === totalPages}  
//         {...({} as any)}>
//           Next
//           <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
//       </Button>
//     </div>
//   )
// }

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
        variant={currentPage === i ? "filled" : "text"}
        color="gray"
        onClick={() => handleClick(i)}
        {...({} as any)}
      >
        {i}
      </IconButton>
    );
  }

  return (
    <div className="flex items-center justify-center h-full gap-4 py-4">
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