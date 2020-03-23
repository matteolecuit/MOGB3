use crate::errors::ServiceError;
use crate::graphql::model::Context;
use crate::profile_picture::model::{ProfilePicture};
use diesel::prelude::*;

pub fn profile_picture_manager_get_all(context: &Context) -> Result<Vec<ProfilePicture>, ServiceError> {
    use crate::schema::profile_pictures::dsl::*;
    let conn: &PgConnection = &context.db;

    Ok(profile_pictures.load::<ProfilePicture>(conn)?)
}

