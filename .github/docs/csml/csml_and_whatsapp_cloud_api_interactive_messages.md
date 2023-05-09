

# Documentations references
- https://docs.csml.dev/language/sending-receiving-messages/message-payloads
- https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages#section-object
- https://developers.facebook.com/docs/whatsapp/guides/interactive-messages/#como-usar
- https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types

# How to User

## Quick buttons

- Quetion up to 3 options

<img src="/.github/docs/csml/2023-05-01_18-38.png"/>

CSML Code example:
```ruby
say Question(
    "What would you like to do today?",
    buttons = [
      Button("Listen to good music", accepts=["music","listen"]) as music,
      Button("Manage my Dropbox account", accepts=["dropbox"]) as dropbox,
      Button("Tell me a joke") as joke
    ],
    header="Header...",
    footer="Footer..."
  )
```

| CSML Field | Example Value | Whatsapp Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 1024 characters) |
| Button | Listen to good music | List option (Max 20 characters) |
| header | Header... | Message header  (Max 60 characters ) |
| footer | Footer... | Message footer  (Max 60 characters ) |


- Quetion up to 3 options and image

*Image replace header*

<img src="/.github/docs/csml/2023-05-03_22-44.png"/>

CSML Code example:
```ruby
say Question(
    "What would you like to do today?",
    buttons = [
      Button("Listen to good music", accepts=["music","listen"]) as music,
      Button("Manage my Dropbox account", accepts=["dropbox"]) as dropbox,
      Button("Tell me a joke") as joke
    ],
    image="https://i.ibb.co/5RXy9fG/My-project-1.jpg",
    footer="Footer..."
  )
```

- Quetion up to 3 options and video

*Video replace header*

<img src="/.github/docs/csml/2023-05-03_22-48.png"/>

CSML Code example:
```ruby
say Question(
    "What would you like to do today?",
    buttons = [
      Button("Listen to good music", accepts=["music","listen"]) as music,
      Button("Manage my Dropbox account", accepts=["dropbox"]) as dropbox,
      Button("Tell me a joke") as joke
    ],
    video="https://media.giphy.com/media/3oKIPsx2VAYAgEHC12/giphy.mp4",
    footer="Footer..."
  )
```

- Quetion up to 3 options and document

*Document replace header*

<img src="/.github/docs/csml/2023-05-03_22-49.png"/>

CSML Code example:
```ruby
say Question(
    "What would you like to do today?",
    buttons = [
      Button("Listen to good music", accepts=["music","listen"]) as music,
      Button("Manage my Dropbox account", accepts=["dropbox"]) as dropbox,
      Button("Tell me a joke") as joke
    ],
    document="https://nyphil.org/~/media/pdfs/program-notes/1819/Brahms-Symphony-No-4.pdf",
    document_name="teste.pdf",
    footer="Footer..."
  )
```

Files limitations:
https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types
<img src="/.github/docs/csml/2023-05-03_22-18.png"/>

## List

<img src="/.github/docs/csml/2023-05-01_18-35.png"/>
<img src="/.github/docs/csml/2023-05-01_18-15.png"/>

Questions with 4 or more options automatically use List
List buttons fields in CSML Bot

CSML Code example:
```ruby
say Question(
    "What would you like to do today?",
    buttons = [
      Button("Listen to good music", accepts=["music","listen"], description="Description 1", section_title="Section 1") as music,
      Button("Manage my Dropbox account", accepts=["dropbox"], section_title="Section 1") as dropbox,
      Button("Tell me a joke") as joke,
      Button("123 Tell me a joke"),
    ],
    style="primary",
    action_button="testing..",
    header="Header...",
    footer="Footer..."
  )
```


| CSML Field | Example Value | Whatsapp Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 1024 characters) |
| Button | Listen to good music | List option (Max 24 characters) |
| Button -> description | Description 1 | Field description (Max 72 characters) |
| Button -> section_title | Section 1 | Section title (Max 24 characters, Max 10 sections) |
| action_button | testing.. | Button open list (Max 20 characters ) |
| header | Header... | Message header  (Max 60 characters ) |
| footer | Footer... | Message footer  (Max 60 characters ) |


*List buttons support only text in header



# Tests

## Files
- spec/services/whatsapp/interactive_messages/providers/cloud/buttons_spec.rb
- spec/services/whatsapp/interactive_messages/providers/cloud/list_spec.rb


