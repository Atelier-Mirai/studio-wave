city_list  = %w(札幌市 仙台市 東京都 京都市 大阪市 福岡市)
ward_list  = %w(北区 東区 南区 西区)
kind_list  = %w(豚骨 醤油 味噌 塩)
name_list  = %w(松鶴 梅鶯 櫻幕 藤帰 菖蒲 牡丹 萩猪 芒月 菊盃 紅葉 柳風 鳳凰)
price_list = %w(280 380 480 580 680 780 880 980)

(1..24).to_a.each.with_index(1) do |_, index|
  city        = city_list.sample
  address     = "#{city}#{ward_list.sample}"
  kind        = kind_list.sample
  kind_romaji = { 豚骨: "tonkotsu", 醤油: "shoyu", 味噌: "miso", 塩: "shio" }[kind.to_sym]
  name        = name_list.sample
  price       = price_list.sample.to_i
  phrase      = if price < 500
                  "お財布に優しいお店である"
                elsif price < 800
                  "良心的な価格設定が嬉しい"
                else
                  "高価だが価値ある逸品"
                end
  comment = "#{name}ラーメンは #{address}にある #{kind}ラーメンが人気のお店。#{price}円と#{phrase}。"
  idx = sprintf("%02d", index)

  html = <<~EOS
    <div class="item" data-color="#{kind_romaji}" data-title="#{comment}">
      <div class="item-content">
        <div class="card">
          <figure class="card-image">
            <img src="images/ramen#{idx}.webp" loading="lazy">
          </figure>
          <h2 class="card-title">
            [#{city}] #{name}ラーメン
          </h2>
          <p class="card-desc">
            #{comment}
          </p>
        </div>
      </div>
    </div>
  EOS

  puts html
end
