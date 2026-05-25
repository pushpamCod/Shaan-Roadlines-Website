import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OpenAI "../lib/openai";

mixin (
  accessControlState : AccessControl.AccessControlState,
  openAIApiKey : { var value : ?Text },
) {
  public query func isOpenAIConfigured() : async Bool {
    openAIApiKey.value != null;
  };

  public shared ({ caller }) func setOpenAIKey(key : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set the OpenAI API key");
    };
    openAIApiKey.value := ?key;
  };

  public shared ({ caller }) func callOpenAI(userMessage : Text) : async { #ok : Text; #err : Text } {
    let ?key = openAIApiKey.value else {
      return #err("OpenAI not configured. Please set API key in admin settings.");
    };
    try {
      let combinedPrompt = "You are TravelEase AI, a helpful travel assistant. Help users find the best travel options, destinations, and travel tips.\n\nUser: " # userMessage;
      let response = await* OpenAI.runChatCompletion(
        OpenAI.configForKey(key),
        combinedPrompt,
      );
      #ok(response);
    } catch (e) {
      #err("OpenAI request failed. Please try again.");
    };
  };
};
