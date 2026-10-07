import Link from "next/link";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hrefForPage: (page: number) => string;
};

const controlClassName = "rounded-lg border border-amber-950/15 bg-white px-3 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-100";
const disabledClassName = "rounded-lg border border-amber-950/10 px-3 py-2 text-sm font-semibold text-amber-950/35";
const pageClassName = "grid size-9 place-items-center rounded-lg border border-amber-950/15 bg-white text-sm font-semibold text-amber-950/75 hover:bg-amber-100";

export function Pagination({ currentPage, totalPages, totalItems, pageSize, hrefForPage }: PaginationProps) {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const windowSize = 5;
    const startPage = Math.max(1, Math.min(currentPage - Math.floor(windowSize / 2), totalPages - windowSize + 1));
    const endPage = Math.min(totalPages, startPage + windowSize - 1);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    return (
        <nav aria-label="ページ送り" className="flex flex-col gap-4 border-t border-amber-950/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-amber-950/60">
                {startItem}〜{endItem}件 / 全{totalItems}件 <span className="mx-2 text-amber-950/25">|</span> {currentPage} / {totalPages}ページ
            </p>
            <div className="flex flex-wrap items-center gap-2">
                {currentPage === 1 ? <span aria-disabled="true" className={disabledClassName}>最初</span> : <Link href={hrefForPage(1)} className={controlClassName}>最初</Link>}
                {currentPage === 1 ? <span aria-disabled="true" className={disabledClassName}>前へ</span> : <Link href={hrefForPage(currentPage - 1)} className={controlClassName}>前へ</Link>}
                {startPage > 1 && <>
                    <Link href={hrefForPage(1)} className={pageClassName}>1</Link>
                    {startPage > 2 && <span aria-hidden="true" className="px-1 text-sm text-amber-950/50">…</span>}
                </>}
                {pages.map((page) => page === currentPage
                    ? <span key={page} aria-current="page" className={`${pageClassName} border-amber-950 bg-amber-950 text-amber-50`}>{page}</span>
                    : <Link key={page} href={hrefForPage(page)} className={pageClassName}>{page}</Link>)}
                {endPage < totalPages && <>
                    {endPage < totalPages - 1 && <span aria-hidden="true" className="px-1 text-sm text-amber-950/50">…</span>}
                    <Link href={hrefForPage(totalPages)} className={pageClassName}>{totalPages}</Link>
                </>}
                {currentPage === totalPages ? <span aria-disabled="true" className={disabledClassName}>次へ</span> : <Link href={hrefForPage(currentPage + 1)} className={controlClassName}>次へ</Link>}
                {currentPage === totalPages ? <span aria-disabled="true" className={disabledClassName}>最後</span> : <Link href={hrefForPage(totalPages)} className={controlClassName}>最後</Link>}
            </div>
        </nav>
    );
}
