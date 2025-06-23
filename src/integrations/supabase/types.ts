export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accommodations: {
        Row: {
          amenities: Json
          bathrooms: number
          description: string
          discount: number | null
          features: Json
          gallery_images: Json
          id: number
          image: string
          location: string
          max_guests: number
          name: string
          price: number
          rating: number
          rooms: number
          rules: Json
          type: string
        }
        Insert: {
          amenities: Json
          bathrooms: number
          description: string
          discount?: number | null
          features: Json
          gallery_images: Json
          id?: number
          image: string
          location: string
          max_guests: number
          name: string
          price: number
          rating: number
          rooms: number
          rules: Json
          type: string
        }
        Update: {
          amenities?: Json
          bathrooms?: number
          description?: string
          discount?: number | null
          features?: Json
          gallery_images?: Json
          id?: number
          image?: string
          location?: string
          max_guests?: number
          name?: string
          price?: number
          rating?: number
          rooms?: number
          rules?: Json
          type?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          created_at: string
          icon_name: string
          id: number
          is_active: boolean
          name: string
          path: string
          rating: number | null
        }
        Insert: {
          created_at?: string
          icon_name: string
          id?: number
          is_active?: boolean
          name: string
          path: string
          rating?: number | null
        }
        Update: {
          created_at?: string
          icon_name?: string
          id?: number
          is_active?: boolean
          name?: string
          path?: string
          rating?: number | null
        }
        Relationships: []
      }
      activity_images: {
        Row: {
          activity_id: number
          alt_text: string
          created_at: string | null
          id: number
          sort_order: number | null
          title: string
          url: string
        }
        Insert: {
          activity_id: number
          alt_text: string
          created_at?: string | null
          id?: number
          sort_order?: number | null
          title: string
          url: string
        }
        Update: {
          activity_id?: number
          alt_text?: string
          created_at?: string | null
          id?: number
          sort_order?: number | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_images_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "leisure_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_inclusions: {
        Row: {
          activity_id: number
          created_at: string | null
          id: number
          inclusion_text: string
        }
        Insert: {
          activity_id: number
          created_at?: string | null
          id?: number
          inclusion_text: string
        }
        Update: {
          activity_id?: number
          created_at?: string | null
          id?: number
          inclusion_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_inclusions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "leisure_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_levels: {
        Row: {
          activity_id: number
          created_at: string | null
          id: number
          level_description: string
          level_name: string
        }
        Insert: {
          activity_id: number
          created_at?: string | null
          id?: number
          level_description: string
          level_name: string
        }
        Update: {
          activity_id?: number
          created_at?: string | null
          id?: number
          level_description?: string
          level_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_levels_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "leisure_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_reservations: {
        Row: {
          activity_id: number
          contact_email: string
          contact_phone: string
          created_at: string | null
          id: number
          number_of_participants: number
          participant_levels: string[]
          participant_names: string[]
          reservation_date: string
          special_requests: string | null
          status: string
          time_slot: string
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_id: number
          contact_email: string
          contact_phone: string
          created_at?: string | null
          id?: number
          number_of_participants?: number
          participant_levels: string[]
          participant_names: string[]
          reservation_date: string
          special_requests?: string | null
          status?: string
          time_slot: string
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_id?: number
          contact_email?: string
          contact_phone?: string
          created_at?: string | null
          id?: number
          number_of_participants?: number
          participant_levels?: string[]
          participant_names?: string[]
          reservation_date?: string
          special_requests?: string | null
          status?: string
          time_slot?: string
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_reservations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "leisure_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_time_slots: {
        Row: {
          activity_id: number
          created_at: string | null
          id: number
          is_active: boolean | null
          time_slot: string
        }
        Insert: {
          activity_id: number
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          time_slot: string
        }
        Update: {
          activity_id?: number
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          time_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_time_slots_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "leisure_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      bons_plans: {
        Row: {
          badge: string | null
          created_at: string | null
          description: string
          icon: string
          id: number
          image: string | null
          is_active: boolean | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: number
          image?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: number
          image?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      car_client_reviews: {
        Row: {
          avatar: string
          comment: string
          created_at: string | null
          id: number
          location: string
          name: string
          rating: number
          rental_company_name: string
          review_date: string
          updated_at: string | null
        }
        Insert: {
          avatar: string
          comment: string
          created_at?: string | null
          id?: number
          location: string
          name: string
          rating: number
          rental_company_name: string
          review_date: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string
          comment?: string
          created_at?: string | null
          id?: number
          location?: string
          name?: string
          rating?: number
          rental_company_name?: string
          review_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      car_models: {
        Row: {
          air_con: boolean
          category: string
          company_id: number
          created_at: string | null
          gallery_images: Json | null
          id: number
          image: string
          is_active: boolean
          name: string
          price_per_day: number
          seats: number
          transmission: string
          updated_at: string | null
        }
        Insert: {
          air_con?: boolean
          category: string
          company_id: number
          created_at?: string | null
          gallery_images?: Json | null
          id?: number
          image: string
          is_active?: boolean
          name: string
          price_per_day: number
          seats: number
          transmission: string
          updated_at?: string | null
        }
        Update: {
          air_con?: boolean
          category?: string
          company_id?: number
          created_at?: string | null
          gallery_images?: Json | null
          id?: number
          image?: string
          is_active?: boolean
          name?: string
          price_per_day?: number
          seats?: number
          transmission?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_models_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "car_rental_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      car_rental_companies: {
        Row: {
          created_at: string | null
          description: string
          gallery_images: Json | null
          icon_name: string
          id: number
          image: string
          location: string
          name: string
          offer: string
          partner_id: string | null
          rating: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          gallery_images?: Json | null
          icon_name: string
          id?: number
          image: string
          location: string
          name: string
          offer: string
          partner_id?: string | null
          rating: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          gallery_images?: Json | null
          icon_name?: string
          id?: number
          image?: string
          location?: string
          name?: string
          offer?: string
          partner_id?: string | null
          rating?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_rental_companies_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      car_rental_features: {
        Row: {
          company_id: number
          created_at: string | null
          feature: string
          id: number
        }
        Insert: {
          company_id: number
          created_at?: string | null
          feature: string
          id?: number
        }
        Update: {
          company_id?: number
          created_at?: string | null
          feature?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "car_rental_features_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "car_rental_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      car_rental_reservations: {
        Row: {
          created_at: string
          driver_email: string
          driver_name: string
          driver_phone: string
          end_date: string
          id: string
          notes: string | null
          partner_id: string | null
          rental_company_name: string
          selected_model: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_email: string
          driver_name: string
          driver_phone: string
          end_date: string
          id?: string
          notes?: string | null
          partner_id?: string | null
          rental_company_name: string
          selected_model: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_email?: string
          driver_name?: string
          driver_phone?: string
          end_date?: string
          id?: string
          notes?: string | null
          partner_id?: string | null
          rental_company_name?: string
          selected_model?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_rental_reservations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      concerts: {
        Row: {
          artist: string
          created_at: string | null
          date: string
          description: string
          gallery_images: Json | null
          genre: string
          icon: string
          id: number
          image: string
          location: string
          name: string
          offer: string
          price: number
          rating: number
          time: string
          updated_at: string | null
        }
        Insert: {
          artist: string
          created_at?: string | null
          date: string
          description: string
          gallery_images?: Json | null
          genre: string
          icon?: string
          id?: number
          image: string
          location: string
          name: string
          offer: string
          price: number
          rating: number
          time: string
          updated_at?: string | null
        }
        Update: {
          artist?: string
          created_at?: string | null
          date?: string
          description?: string
          gallery_images?: Json | null
          genre?: string
          icon?: string
          id?: number
          image?: string
          location?: string
          name?: string
          offer?: string
          price?: number
          rating?: number
          time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      diving_reservations: {
        Row: {
          created_at: string
          experience_level: string
          id: string
          participant_email: string
          participant_name: string
          participant_phone: string
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience_level?: string
          id?: string
          participant_email: string
          participant_name: string
          participant_phone: string
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience_level?: string
          id?: string
          participant_email?: string
          participant_name?: string
          participant_phone?: string
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      fleet_managers: {
        Row: {
          company_id: number
          created_at: string
          id: string
          permissions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: number
          created_at?: string
          id?: string
          permissions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: number
          created_at?: string
          id?: string
          permissions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_managers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "car_rental_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      leisure_activities: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration_hours: number
          equipment_provided: boolean | null
          icon_name: string
          id: number
          max_participants: number | null
          min_level: string
          name: string
          price_per_person: number
          professional_guide: boolean | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration_hours: number
          equipment_provided?: boolean | null
          icon_name?: string
          id?: number
          max_participants?: number | null
          min_level: string
          name: string
          price_per_person: number
          professional_guide?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration_hours?: number
          equipment_provided?: boolean | null
          icon_name?: string
          id?: number
          max_participants?: number | null
          min_level?: string
          name?: string
          price_per_person?: number
          professional_guide?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loisirs: {
        Row: {
          current_participants: number
          description: string
          end_date: string
          gallery_images: Json | null
          id: number
          image: string
          location: string
          max_participants: number
          start_date: string
          title: string
        }
        Insert: {
          current_participants?: number
          description: string
          end_date?: string
          gallery_images?: Json | null
          id?: number
          image: string
          location: string
          max_participants: number
          start_date: string
          title: string
        }
        Update: {
          current_participants?: number
          description?: string
          end_date?: string
          gallery_images?: Json | null
          id?: number
          image?: string
          location?: string
          max_participants?: number
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      loisirs_inscriptions: {
        Row: {
          confirmation_sent: boolean
          email: string
          id: number
          inscription_date: string
          loisir_id: number
          name: string
          phone: string
        }
        Insert: {
          confirmation_sent?: boolean
          email: string
          id?: number
          inscription_date?: string
          loisir_id: number
          name: string
          phone: string
        }
        Update: {
          confirmation_sent?: boolean
          email?: string
          id?: number
          inscription_date?: string
          loisir_id?: number
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "loisirs_inscriptions_loisir_id_fkey"
            columns: ["loisir_id"]
            isOneToOne: false
            referencedRelation: "loisirs"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      nightlife_events: {
        Row: {
          created_at: string | null
          date: string
          description: string
          features: Json
          gallery_images: Json | null
          id: number
          image: string
          name: string
          offer: string
          price: number
          rating: number
          time: string
          type: string
          updated_at: string | null
          venue: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description: string
          features?: Json
          gallery_images?: Json | null
          id?: number
          image: string
          name: string
          offer: string
          price: number
          rating: number
          time: string
          type: string
          updated_at?: string | null
          venue: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string
          features?: Json
          gallery_images?: Json | null
          id?: number
          image?: string
          name?: string
          offer?: string
          price?: number
          rating?: number
          time?: string
          type?: string
          updated_at?: string | null
          venue?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          description: string
          discount_percentage: number | null
          end_date: string | null
          id: string
          is_active: boolean
          partner_id: string
          price: number | null
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          partner_id: string
          price?: number | null
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          partner_id?: string
          price?: number | null
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          business_name: string
          business_type: string
          created_at: string
          description: string | null
          id: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type: string
          created_at?: string
          description?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string
          created_at?: string
          description?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_type: Database["public"]["Enums"]["admin_type"] | null
          company_id: number | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          admin_type?: Database["public"]["Enums"]["admin_type"] | null
          company_id?: number | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          admin_type?: Database["public"]["Enums"]["admin_type"] | null
          company_id?: number | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "car_rental_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          badge: string | null
          created_at: string | null
          cta_text: string
          cta_url: string
          description: string
          id: number
          image: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          cta_text: string
          cta_url: string
          description: string
          id?: number
          image: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          cta_text?: string
          cta_url?: string
          description?: string
          id?: number
          image?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          email: string
          id: string
          item_name: string
          item_type: string
          purchase_date: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          item_name: string
          item_type: string
          purchase_date?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          item_name?: string
          item_type?: string
          purchase_date?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          number_of_people: number | null
          offer_id: string | null
          partner_id: string
          reservation_date: string
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          number_of_people?: number | null
          offer_id?: string | null
          partner_id: string
          reservation_date: string
          special_requests?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          number_of_people?: number | null
          offer_id?: string | null
          partner_id?: string
          reservation_date?: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservations: {
        Row: {
          created_at: string
          email: string
          guests: number
          id: string
          name: string
          notes: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          restaurant_id: number
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          guests: number
          id?: string
          name: string
          notes?: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          restaurant_id: number
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          guests?: number
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          reservation_date?: string
          reservation_time?: string
          restaurant_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          description: string
          gallery_images: Json | null
          icon: string
          id: number
          image: string
          location: string
          name: string
          offer: string
          rating: number
          type: string
        }
        Insert: {
          description: string
          gallery_images?: Json | null
          icon: string
          id?: number
          image: string
          location: string
          name: string
          offer: string
          rating: number
          type: string
        }
        Update: {
          description?: string
          gallery_images?: Json | null
          icon?: string
          id?: number
          image?: string
          location?: string
          name?: string
          offer?: string
          rating?: number
          type?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_price: number | null
          subscription_start: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_price?: number | null
          subscription_start?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_price?: number | null
          subscription_start?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          currency: string
          end_date: string | null
          id: string
          plan_name: string
          price: number
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          plan_name: string
          price: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          plan_name?: string
          price?: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_offers: {
        Row: {
          created_at: string | null
          current_participants: number | null
          departure_date: string | null
          departure_location: string
          description: string
          destination: string
          duration_days: number
          exclusions: Json | null
          gallery_images: Json | null
          id: number
          image: string | null
          inclusions: Json | null
          is_active: boolean | null
          max_participants: number | null
          partner_id: string | null
          price: number
          return_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          departure_date?: string | null
          departure_location: string
          description: string
          destination: string
          duration_days: number
          exclusions?: Json | null
          gallery_images?: Json | null
          id?: number
          image?: string | null
          inclusions?: Json | null
          is_active?: boolean | null
          max_participants?: number | null
          partner_id?: string | null
          price: number
          return_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          departure_date?: string | null
          departure_location?: string
          description?: string
          destination?: string
          duration_days?: number
          exclusions?: Json | null
          gallery_images?: Json | null
          id?: number
          image?: string | null
          inclusions?: Json | null
          is_active?: boolean | null
          max_participants?: number | null
          partner_id?: string | null
          price?: number
          return_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_offers_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consumption: {
        Row: {
          amount_consumed: number
          consumption_date: string
          created_at: string
          currency: string
          id: string
          service_name: string
          service_type: string
          status: string
          user_id: string
        }
        Insert: {
          amount_consumed: number
          consumption_date?: string
          created_at?: string
          currency?: string
          id?: string
          service_name: string
          service_type: string
          status?: string
          user_id: string
        }
        Update: {
          amount_consumed?: number
          consumption_date?: string
          created_at?: string
          currency?: string
          id?: string
          service_name?: string
          service_type?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consumption_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voyance_consultations: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          consultation_type: string
          created_at: string
          id: string
          medium_id: number
          message: string | null
          preferred_date: string
          preferred_time: string
          status: string
          updated_at: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          consultation_type?: string
          created_at?: string
          id?: string
          medium_id: number
          message?: string | null
          preferred_date: string
          preferred_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          consultation_type?: string
          created_at?: string
          id?: string
          medium_id?: number
          message?: string | null
          preferred_date?: string
          preferred_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voyance_consultations_medium_id_fkey"
            columns: ["medium_id"]
            isOneToOne: false
            referencedRelation: "voyance_mediums"
            referencedColumns: ["id"]
          },
        ]
      }
      voyance_medium_advantages: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: number
          is_active: boolean
          medium_id: number
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: number
          is_active?: boolean
          medium_id: number
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: number
          is_active?: boolean
          medium_id?: number
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "voyance_medium_advantages_medium_id_fkey"
            columns: ["medium_id"]
            isOneToOne: false
            referencedRelation: "voyance_mediums"
            referencedColumns: ["id"]
          },
        ]
      }
      voyance_mediums: {
        Row: {
          availability_schedule: Json
          consultation_types: string[]
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string
          description: string
          experience_years: number
          gallery_images: Json | null
          id: number
          image: string
          is_active: boolean
          languages: string[]
          location: string | null
          name: string
          price_per_session: number
          rating: number
          specialties: string[]
          updated_at: string
        }
        Insert: {
          availability_schedule?: Json
          consultation_types?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          description: string
          experience_years?: number
          gallery_images?: Json | null
          id?: number
          image: string
          is_active?: boolean
          languages?: string[]
          location?: string | null
          name: string
          price_per_session: number
          rating?: number
          specialties?: string[]
          updated_at?: string
        }
        Update: {
          availability_schedule?: Json
          consultation_types?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          description?: string
          experience_years?: number
          gallery_images?: Json | null
          id?: number
          image?: string
          is_active?: boolean
          languages?: string[]
          location?: string | null
          name?: string
          price_per_session?: number
          rating?: number
          specialties?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      voyance_reviews: {
        Row: {
          client_name: string
          comment: string
          consultation_date: string
          created_at: string
          id: number
          medium_id: number
          rating: number
        }
        Insert: {
          client_name: string
          comment: string
          consultation_date: string
          created_at?: string
          id?: number
          medium_id: number
          rating: number
        }
        Update: {
          client_name?: string
          comment?: string
          consultation_date?: string
          created_at?: string
          id?: number
          medium_id?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "voyance_reviews_medium_id_fkey"
            columns: ["medium_id"]
            isOneToOne: false
            referencedRelation: "voyance_mediums"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_partner_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      admin_type: "super_admin" | "partner_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_type: ["super_admin", "partner_admin"],
    },
  },
} as const
