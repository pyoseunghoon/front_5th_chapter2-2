interface Props {
  keyword: string;
  setKeyword: (value: string) => void;
}

export const SearchProducts = ({ keyword, setKeyword }: Props) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="상품명 검색"
        className="p-2 border rounded w-60"
      />
    </div>
  );
};
