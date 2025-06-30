import { useAuth } from '@/hooks/useAuth';
import { usePartnerActivities } from '@/hooks/usePartnerActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PermissionsTest = () => {
  const { profile, isSuperAdmin, isPartnerAdmin, canAccessAllData } = useAuth();
  const { 
    partnerActivities, 
    getActivityIds, 
    getPartnerIds, 
    canAccessActivity, 
    canAccessPartner,
    loading 
  } = usePartnerActivities();

  if (loading) {
    return <div>Chargement des permissions...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Test du Système de Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Utilisateur connecté :</h3>
            <p>Email: {profile?.email}</p>
            <p>Rôle: {profile?.role}</p>
            <p>Type admin: {profile?.admin_type}</p>
            <div className="flex gap-2 mt-2">
              {isSuperAdmin && <Badge variant="default">Super Admin</Badge>}
              {isPartnerAdmin && <Badge variant="secondary">Admin Partenaire</Badge>}
              {canAccessAllData && <Badge variant="destructive">Accès Total</Badge>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Relations Partenaire-Activités :</h3>
            {partnerActivities.length > 0 ? (
              <ul className="list-disc list-inside">
                {partnerActivities.map((relation, index) => (
                  <li key={index}>
                    Partenaire {relation.partner_id} → {relation.activity_type} {relation.activity_id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Aucune relation trouvée</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold">Partenaires accessibles :</h3>
            <p>IDs: {getPartnerIds().join(', ') || 'Aucun'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Activités accessibles :</h3>
            <div className="space-y-1 text-sm">
              <p>Restaurants: {getActivityIds('restaurant').join(', ') || 'Aucun'}</p>
              <p>Hébergements: {getActivityIds('accommodation').join(', ') || 'Aucun'}</p>
              <p>Concerts: {getActivityIds('concert').join(', ') || 'Aucun'}</p>
              <p>Soirées: {getActivityIds('nightlife').join(', ') || 'Aucun'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Tests d'accès :</h3>
            <div className="space-y-2">
              <p>
                Peut accéder au partenaire 10: {' '}
                <Badge variant={canAccessPartner(10) ? "default" : "destructive"}>
                  {canAccessPartner(10) ? 'OUI' : 'NON'}
                </Badge>
              </p>
              <p>
                Peut accéder au restaurant 15: {' '}
                <Badge variant={canAccessActivity('restaurant', 15) ? "default" : "destructive"}>
                  {canAccessActivity('restaurant', 15) ? 'OUI' : 'NON'}
                </Badge>
              </p>
              <p>
                Peut accéder à l'hébergement 5: {' '}
                <Badge variant={canAccessActivity('accommodation', 5) ? "default" : "destructive"}>
                  {canAccessActivity('accommodation', 5) ? 'OUI' : 'NON'}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">(doit être NON)</span>
              </p>
              <p>
                Peut accéder au concert 8: {' '}
                <Badge variant={canAccessActivity('concert', 8) ? "default" : "destructive"}>
                  {canAccessActivity('concert', 8) ? 'OUI' : 'NON'}
                </Badge>
              </p>
              <p>
                Peut accéder à la soirée 12: {' '}
                <Badge variant={canAccessActivity('nightlife', 12) ? "default" : "destructive"}>
                  {canAccessActivity('nightlife', 12) ? 'OUI' : 'NON'}
                </Badge>
              </p>
              <p>
                Peut accéder au restaurant 999: {' '}
                <Badge variant={canAccessActivity('restaurant', 999) ? "default" : "destructive"}>
                  {canAccessActivity('restaurant', 999) ? 'OUI' : 'NON'}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};