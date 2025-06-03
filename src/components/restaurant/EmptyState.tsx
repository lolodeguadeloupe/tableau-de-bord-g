
export function EmptyState() {
  return (
    <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-lg font-medium text-yellow-800">Aucun restaurant trouvé</p>
      <p className="text-yellow-600 mt-2">
        La table 'restaurants' semble être vide. Créez votre premier restaurant en cliquant sur "Nouveau restaurant".
      </p>
    </div>
  )
}
