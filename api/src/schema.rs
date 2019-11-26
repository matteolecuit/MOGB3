table! {
    users (user_id) {
        user_id -> Int4,
        user_uuid -> Uuid,
        hash -> Bytea,
        salt -> Varchar,
        email -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        username -> Varchar,
        play_count -> Int4,
        win_count -> Int4,
        experience -> Int4,
        score -> Int4,
    }
}