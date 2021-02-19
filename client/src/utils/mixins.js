import {
   parseISO,
   differenceInSeconds,
   differenceInMinutes,
   differenceInHours,
   differenceInDays,
   differenceInWeeks,
   differenceInMonths,
   differenceInYears
} from "date-fns"

export const fileIconMixin = {
   computed: {
      fileIcon: function() {
         return {
            typescript: "typescript-plain",
            javascript: "javascript-plain",
            react: "react-original",
            java: "java-plain",
            scala: "scala-plain",
            golang: "go-plain",
            ruby: "ruby-plain",
            php: "php-plain",
            css: "css3-plain",
            sass: "sass-original",
            scss: "sass-original",
            "c#": "csharp-plain",
            c: "c-plain",
            "c++": "cplusplus-plain",
            shell: "bash-plain",
            json: "slack-plain",
            yaml: "slack-plain",
            xml: "slack-plain",
            clojure: "clojure-line",
            dart: "flutter-plain",
            python: "python-plain",
            elixir: "slack-plain",
            haskell: "haskell-plain",
            rust: "rust-plain",
            julia: "slack-plain",
            crystal: "slack-plain",
            kotlin: "kotlin-plain",
            lua: "slack-plain",
            markdown: "slack-plain",
            html: "html5-plain",
            swift: "swift-plain",
            cython: "python-plain",
            dockerfile: "docker-plain",
            gdscript: "slack-plain",
            gradle: "gradle-plain",
            sql: "slack-plain",
            graphql: "slack-plain",
            jupyter_notebook: "slack-plain",
            text: "slack-plain",
            vue: "vuejs-plain",
            protobuf: "slack-plain",
            solidity: "slack-plain",
            v: "slack-plain",
            zig: "slack-plain",
         }
      }
   }
}

export const dateMixin = {
   methods: {
      getTimeSince: function(timestamp, output) {
         let diff;
         timestamp = parseISO(timestamp);

         const isSecond = differenceInSeconds(new Date(), timestamp) < 60;
         const isMinute = differenceInMinutes(new Date(), timestamp) < 60;
         const isHour = differenceInHours(new Date(), timestamp) < 24;
         const isDay = differenceInDays(new Date(), timestamp) < 7;
         const isWeek = differenceInWeeks(new Date(), timestamp) < 4;
         const isMonth = differenceInMonths(new Date(), timestamp) < 12;

         if(isSecond) {
            diff = differenceInSeconds(new Date(), timestamp);
            return output === "short" ?
               `${diff}s`
            :
               `${diff} second${diff > 1 ? "s" : ""} ago`;
         }

         if(isMinute) {
            diff = differenceInMinutes(new Date(), timestamp);
            return output === "short" ?
               `${diff}m`
            :
               `${diff} minute${diff > 1 ? "s" : ""} ago`;
         }

         if(isHour) {
            diff = differenceInHours(new Date(), timestamp);
            return output === "short" ?
               `${diff}h`
            :
               `${diff} hour${diff > 1 ? "s" : ""} ago`;
         }

         if(isDay) {
            diff = differenceInDays(new Date(), timestamp);
            return output === "short" ?
               `${diff}d`
            :
               `${diff} day${diff > 1 ? "s" : ""} ago`;
         }
      
         if(isWeek) {
            diff = differenceInWeeks(new Date(), timestamp);
            return output === "short" ?
               `${diff}w`
            :
               `${diff} week${diff > 1 ? "s" : ""} ago`;
         }
         
         if(isMonth) {
            diff = differenceInMonths(new Date(), timestamp);
            return output === "short" ?
               `${diff}m`
            :
               `${diff} month${diff > 1 ? "s" : ""} ago`;
         }

         diff = differenceInYears(new Date(), timestamp);
         return output === "short" ?
            `${diff}y`
         :
            `${diff} year${diff > 1 ? "s" : ""} ago`
      }
   }
}