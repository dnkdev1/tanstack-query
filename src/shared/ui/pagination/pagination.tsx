import {PaginationNav} from "./pagination-nav/pagination-nav.tsx";
import s from './pagination.module.css'

type Props = {
    currentPage: number
    pageCount: number
    onPageNumberChange: (page: number) => void
    isFetching: boolean
}

export const Pagination = ({ currentPage, pageCount, onPageNumberChange, isFetching }: Props) => {
    return (
        <div className={s.container}>
            <PaginationNav current={currentPage} pagesCount={pageCount} onChange={onPageNumberChange} />{" "}
            {isFetching && "X"}
        </div>
    )
}