use crate::schema::*;
use chrono::*;
use uuid::Uuid;
extern crate rand;
use crate::user::util::{make_hash, make_salt};

#[derive(Debug, Serialize, Deserialize, Queryable, juniper::GraphQLObject)]
pub struct User {
    pub user_id: i32,
    pub user_uuid: Uuid,
    #[graphql(skip)]
    pub hash: Vec<u8>,
    pub salt: String,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub username: String,
    pub play_count: i32,
    pub win_count: i32,
    pub experience: i32,
    pub score: i32,
    pub profile_picture: i32,
}

#[derive(Debug, Insertable)]
#[table_name = "users"]
pub struct UserInsert {
    pub user_uuid: Uuid,
    pub hash: Vec<u8>,
    pub salt: String,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub username: String,
}

#[derive(Debug, Deserialize)]
pub struct UserData {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SlimUser {
    pub email: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AuthData {
    pub email: String,
    pub password: String,
}

pub type LoggedUser = SlimUser;

impl User {
    pub fn new<S: Into<String>, T: Into<String>, N: Into<String>>(
        email: S,
        pwd: T,
        username: N,
    ) -> UserInsert {
        let salt = make_salt();
        let hash = make_hash(&pwd.into(), &salt);
        UserInsert {
            user_uuid: Uuid::new_v4(),
            email: email.into(),
            hash,
            created_at: chrono::Local::now().naive_local(),
            updated_at: chrono::Local::now().naive_local(),
            salt,
            username: username.into(),
        }
    }
}

impl From<User> for SlimUser {
    fn from(user: User) -> Self {
        SlimUser {
            email: Option::from(user.email),
        }
    }
}
