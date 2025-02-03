export function CatFilters({ filters, setFilters }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 bg-white h-fit">
      <h2 className="text-xl font-bold mb-6">Filter</h2>

      <div className="space-y-4">
        {/* Filter Ras */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ras</label>
          <select
            value={filters.breed}
            onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
          >
            <option value="Semua">Semua</option>
            <option value="Persian">Persian</option>
            <option value="Siamese">Siamese</option>
            <option value="Maine Coon">Maine Coon</option>
            <option value="Bengal">Bengal</option>
            <option value="Ragdoll">Ragdoll</option>
            <option value="Abyssinian">Abyssinian</option>
            <option value="British Shorthair">British Shorthair</option>
            <option value="Scottish Fold">Scottish Fold</option>
            <option value="Sphynx">Sphynx</option>
            <option value="Russian Blue">Russian Blue</option>
            <option value="Birman">Birman</option>
          </select>
        </div>

        {/* Filter Usia */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia</label>
          <select
            value={filters.age}
            onChange={(e) => setFilters({ ...filters, age: e.target.value })}
            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
          >
            <option value="Semua">Semua</option>
            <option value="Anak">Anak (0-1 tahun)</option>
            <option value="Muda">Muda (2-5 tahun)</option>
            <option value="Dewasa">Dewasa (lebih dari 5 tahun)</option>
          </select>
        </div>

        {/* Filter Jenis Kelamin */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Jenis Kelamin</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/20"
          >
            <option value="Semua">Semua</option>
            <option value="male">Jantan</option>
            <option value="female">Betina</option>
          </select>
        </div>
      </div>
    </div>
  );
}
