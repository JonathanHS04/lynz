import { searchMockData } from "@/app/searchMockData";
import SearchResultItem from "./SearchResultItem";
import Section from "./Section";

const recentSearches = [
  searchMockData[0],
  searchMockData[4],
  searchMockData[7],
  searchMockData[2],
];

function SearchPanel({ query, results, onSelect }) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="rounded-xl p-4 bg-[#121212] shadow-2xl border border-white/5 overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto pt-3">
        {hasQuery ? (
          results.length ? (
            <Section title="Resultados">
              {results.map((item) => (
                <SearchResultItem key={item.id} item={item} onSelect={onSelect} />
              ))}
            </Section>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold text-white">
                No encontramos resultados
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Intenta con otro término
              </p>
            </div>
          )
        ) : (
          <Section title="Recientes">
            {recentSearches.map((item) => (
              <SearchResultItem key={item.id} item={item} onSelect={onSelect} />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

export default SearchPanel;