
// supabase/functions/is-game-running/index.ts

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Create Supabase client with service role key (has full access)
serve(async (req: Request): Promise<Response> => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { userId } = await req.json();

  const { data, error } = await supabase
    .from("Games")
    .select("game_id, player_x_id, player_o_id")
    .or(`player_x_id.eq.${userId},player_o_id.eq.${userId}`)
    .is("winner", null)
    .limit(1)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (data) {
    const otherPlayerId =
      data.player_x_id === userId ? data.player_o_id : data.player_x_id;

    return new Response(
      JSON.stringify({
        gameRunning: true,
        gameId: data.game_id,
        otherPlayerId,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ gameRunning: false }), {
    headers: { "Content-Type": "application/json" },
  });
});
