

# How to User


| Channel | Support |
| --- | --- | --- |
| Whatsapp (CloudAPI)  | ✅ |
| Whatsapp (360Dialog) | ✅ |
| Facebook Messenger | ✅ |
| Instagram | ✅ |
| Web Widget | ✅ |
| Telegram | ✅ |


## Quick buttons

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


<details>
  <summary>Whatsapp</summary><blockquote>
  

  Quetion up to 3 options

<img src="/.github/docs/csml/2023-05-01_18-38.png"/>


| CSML Field | Example Value | Whatsapp Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 1024 characters) |
| Button | Listen to good music | List option (Max 20 characters) |
| header | Header... | Message header  (Max 60 characters ) |
| footer | Footer... | Message footer  (Max 60 characters ) |


#### Messages with attachment

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


</blockquote></details>


<details><summary>Instagram</summary><blockquote><p>

<img src="/.github/docs/csml/instagram_quick_buttons.png"/>


Quetion up to 13 options

`This feature is currently available on instagram app`

| CSML Field | Example Value | Instagram Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 1000 characters) |
| Button | Listen to good music | List option (Max 20 characters) |
| header | Header... | Not compatible |
| footer | Footer.. | Not compatible |

</p></blockquote></details>


<details><summary>Messenger</summary><blockquote><p>

<img width="250" src="/.github/docs/csml/2023-05-06_13-26.png"/>

- Quetion up to 13 options


| CSML Field | Example Value | Messenger Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 2000 characters) |
| Button | Listen to good music | List option (Max 20 characters) |
| header | Header... | Not compatible |
| footer | Footer.. | Not compatible |
| image |  | Not compatible  |
| video |  | Not compatible  |
| document | | Not compatible  |

</p></blockquote></details>

<details><summary>Web Widget</summary><blockquote><p>

<img width="250" src="/.github/docs/csml/2023-05-30_08-42.png"/>

Image:
<img width="250" src="/.github/docs/csml/2023-05-30_18-10.png"/>

Video:
<img width="250" src="/.github/docs/csml/2023-05-30_18-07.png"/>

Document:
<img width="250" src="/.github/docs/csml/2023-05-30_18-11.png"/>


| CSML Field | Example Value | Messenger Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 15000 characters) |
| Button | Listen to good music | List option |
| header | Header... | Not compatible |
| footer | Footer.. | Not compatible |
| footer | Footer.. | Not compatible |
| image |  | https://i.ibb.co/5RXy9fG/My-project-1.jpg  |
| video |  | https://media.giphy.com/media/3oKIPsx2VAYAgEHC12/giphy.mp4 |
| document | | https://nyphil.org/~/media/pdfs/program-notes/1819/Brahms-Symphony-No-4.pdf |

</p></blockquote></details>

<details><summary>Telegram</summary><blockquote><p>

<img width="250" src="/.github/docs/csml/2023-05-24_07-54.png"/>


| CSML Field | Example Value | Messenger Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (1-4096 characters) |
| Button | Listen to good music | List option  |
| header | Header... | Not compatible |
| footer | Footer.. | Not compatible |
| image | https://i.ibb.co/5RXy9fG/My-project-1.jpg | Compatible  |
| video | https://media.giphy.com/media/3oKIPsx2VAYAgEHC12/giphy.mp4  | Compatible |
| document | https://nyphil.org/~/media/pdfs/program-notes/1819/Brahms-Symphony-No-4.pdf | Compatible |

</p></blockquote></details>

## List

<img src="/.github/docs/csml/2023-05-01_18-35.png"/>

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
    action_button="testing..",
    header="Header...",
    footer="Footer..."
  )
```

<details><summary>Whatsapp</summary><blockquote><p>

Questions with 4 or more options automatically use List


#### Fields


<img src="/.github/docs/csml/2023-05-01_18-15.png"/>


| CSML Field | Example Value | Whatsapp Field |
| --- | --- | --- |
| Question  | What would you like to do today? | Message body (Max 1024 characters) |
| Button | Listen to good music | List option (Max 24 characters) |
| Button -> description | Description 1 | Field description (Max 72 characters) |
| Button -> section_title | Section 1 | Section title (Max 24 characters, Max 10 sections) |
| action_button | testing.. | Button open list (Max 20 characters ) |
| header | Header... | Message header  (Max 60 characters ) |
| footer | Footer... | Message footer  (Max 60 characters ) |


</p></blockquote></details>

<details><summary>Instagram</summary><blockquote><p>
Not compatible
</p></blockquote></details>

<details><summary>Messenger</summary><blockquote>
Not compatible
</blockquote></details>

<details><summary>Web Widget</summary><blockquote>
Not compatible
</blockquote></details>

<details><summary>Telegram</summary><blockquote>
Not compatible
</blockquote></details>


## Products

CSML Code example:
```ruby
start:
  say "Hello stranger! 👋"
  say Component.WhatsappProducts(
    content="testing body",
    header="testing2",
    catalog_id="1183719818989019",
    products=[{"section_title": "section title...", "skus": ["5r4tap9sy6"]}],
    footer="footer testing.."
    )
  goto end

```

<img src="/.github/docs/csml/2023-06-27_00-32.png"/>
<img src="/.github/docs/csml/2023-06-27_00-53.png"/>

| CSML Field | Example Value | Whatsapp Field | Required |
| --- | --- | --- | --- |
| content  | testing body | Message body (Max 1024 characters) | Yes |
| header | testing2|  | Yes
| catalog_id | 1183719818989019|  | Yes
| products | `{"section_title": "section title...", "skus": ["5r4tap9sy6"]}` | Maximum 30 products and 10 sections  | Yes |
| footer | footer testing..| Maximum 60 characters. | No |

# Tests

## Files
- spec/services/whatsapp/interactive_messages/providers/cloud/buttons_spec.rb
- spec/services/whatsapp/interactive_messages/providers/cloud/list_spec.rb
- spec/services/instagram/send_on_instagram_service_quick_replies_spec.rb
- spec/services/facebook/send_on_facebook_service_buttons_spec.rb
- spec/services/whatsapp/interactive_messages/providers/360_dialog/buttons_spec.rb
- spec/services/whatsapp/interactive_messages/providers/360_dialog/list_spec.rb
- spec/models/channel/telegram_buttons_spec.rb
- spec/services/whatsapp/interactive_messages/providers/360_dialog/products_spec.rb
- spec/services/whatsapp/interactive_messages/providers/cloud/products_spec.rb
- spec/requests/webhooks/whatsapp_controller/bot_csml_flow/products_flow_spec.rb

# Documentations references
- https://docs.csml.dev/language/sending-receiving-messages/message-payloads
- https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages#section-object
- https://developers.facebook.com/docs/whatsapp/guides/interactive-messages/#como-usar
- https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies?locale=en_US
- https://docs.360dialog.com/docs/whatsapp-api/sandbox
- https://core.telegram.org/bots/api#sendmessage
- https://core.telegram.org/bots/api#inlinekeyboardmarkup
- https://core.telegram.org/bots/features#commands
- https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers/