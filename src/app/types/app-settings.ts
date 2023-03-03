export type RepositorySettings = {
  repository_name: string,
  repository_owner: string,
  github_access_token: string,
  branch_name: string,
  path_to_posts: string,
  path_to_images: string,
};

export type FrontMatterSettings = {
  body: string,
};

export type Settings = {
  posteiro_settings: {
    file_version: string,
    build_at: string,
    export_at: string,
  },
  repository: Omit<RepositorySettings, 'github_access_token'>,
  front_matter: FrontMatterSettings,
}
